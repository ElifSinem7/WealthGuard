const db = require('../config/database');

/**
 * Get all payments for the authenticated user
 * @route GET /api/payments
 */
exports.getPayments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const checkAndUpdateTable = async () => {
      try {
        console.log("Veritabanı tablosu kontrol ediliyor...");
        
        // Tablo yapısını kontrol et
        const [columns] = await db.execute("SHOW COLUMNS FROM recurring_transactions");
        const columnNames = columns.map(col => col.Field);
        
        // paid sütunu yoksa ekle
        if (!columnNames.includes('paid')) {
          console.log("'paid' sütunu ekleniyor...");
          await db.execute("ALTER TABLE recurring_transactions ADD COLUMN paid TINYINT(1) NOT NULL DEFAULT 0");
          console.log("'paid' sütunu eklendi");
        }
        
        // icon sütunu yoksa ekle
        if (!columnNames.includes('icon')) {
          console.log("'icon' sütunu ekleniyor...");
          await db.execute("ALTER TABLE recurring_transactions ADD COLUMN icon VARCHAR(50) DEFAULT 'default'");
          console.log("'icon' sütunu eklendi");
        }
        
        console.log("Veritabanı tablosu güncel");
      } catch (error) {
        console.error("Veritabanı tablosu güncelleme hatası:", error);
      }
    };
    
    // Uygulama başlangıcında tabloyu kontrol et
    await checkAndUpdateTable();

    // Get query parameters for filtering
    const { paid, category_id } = req.query;
    
    // Base query - category_id kullanılıyor
    let query = `
      SELECT rt.id, rt.category_id, rt.description as name, rt.amount, rt.day_of_month, 
            rt.type, rt.paid, rt.icon,
            c.name as category
      FROM recurring_transactions rt
      LEFT JOIN categories c ON rt.category_id = c.id
      WHERE rt.user_id = ?
    `;
    
    // Create array to hold parameters
    const queryParams = [userId];
    
    // Add filters if provided
    if (paid !== undefined) {
      query += ' AND rt.paid = ?';
      queryParams.push(paid === 'true' ? 1 : 0);
    }
    
    if (category_id) {
      query += ' AND rt.category_id = ?';
      queryParams.push(category_id);
    }
    
    // Add ordering
    query += ' ORDER BY rt.day_of_month ASC';
    
    console.log("SQL Sorgusu:", query);
    console.log("Parametreler:", queryParams);
    
    // Execute query
    const [payments] = await db.execute(query, queryParams);
    console.log("Veritabanından gelen ödemeler:", payments);
    
    // Format the response
    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      name: payment.name,
      category: payment.category,
      category_id: payment.category_id,
      amount: payment.amount,
      dueDate: payment.day_of_month, // Burada day_of_month'u dueDate olarak değiştiriyoruz
      paid: payment.paid === 1, // Convert to boolean
      icon: payment.icon || (payment.category ? payment.category.toLowerCase() : 'default')
    }));
    
    console.log("Frontend'e gönderilen ödemeler:", formattedPayments);
    
    res.status(200).json({
      status: 'success',
      count: formattedPayments.length,
      data: formattedPayments
    });
  } catch (error) {
    console.error("getPayments hatası:", error);
    next(error);
  }
};

/**
 * Get a single payment by ID
 * @route GET /api/payments/:id
 */
exports.getPaymentById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const paymentId = req.params.id;
    
    const [payments] = await db.execute(
      `SELECT rt.id, rt.category_id, rt.description as name, rt.amount, rt.day_of_month, 
             rt.type, rt.paid, rt.icon, c.name as category
       FROM recurring_transactions rt
       LEFT JOIN categories c ON rt.category_id = c.id
       WHERE rt.user_id = ? AND rt.id = ?`,
      [userId, paymentId]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }
    
    const payment = payments[0];
    const formattedPayment = {
      id: payment.id,
      name: payment.name,
      category: payment.category,
      category_id: payment.category_id,
      amount: payment.amount,
      dueDate: payment.day_of_month,
      paid: payment.paid === 1,
      icon: payment.icon || (payment.category ? payment.category.toLowerCase() : 'default')
    };
    
    res.status(200).json({
      status: 'success',
      data: formattedPayment
    });
  } catch (error) {
    console.error("getPaymentById hatası:", error);
    next(error);
  }
};

/**
 * Create a new payment
 * @route POST /api/payments
 */
exports.addPayment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log("Ödeme ekleme verileri:", req.body);
    
    // Frontend'den gelen verileri al
    const { name, category, amount, day_of_month, dueDate, icon } = req.body;
    
    // Frontend'den gelen alanlar için bir düzeltme yapalım
    // description, day_of_month veya dueDate hangisi geldiyse kullanalım
    const description = req.body.description || name;
    const dayOfMonth = day_of_month || dueDate || 1; // Varsayılan değer ayın 1'i
    
    console.log("İşlenmiş veriler:", {
      userId,
      description,
      category,
      amount,
      dayOfMonth,
      icon
    });
    
    // Input validation
    if (!description || !category || !amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Lütfen name/description, category, amount değerlerini giriniz'
      });
    }
    
    // Kategori ID'sini bul veya oluştur
    let categoryId;
    const [categories] = await db.execute(
      'SELECT id FROM categories WHERE name = ? AND user_id = ?',
      [category, userId]
    );
    
    if (categories.length > 0) {
      categoryId = categories[0].id;
    } else {
      // Kategori yoksa oluştur
      const [result] = await db.execute(
        'INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)',
        [category, 'expense', userId]
      );
      categoryId = result.insertId;
    }
    
    console.log("Kategori ID:", categoryId);
    
    // Veritabanındaki mevcut sütunları kullanarak ekleme yap
    const [result] = await db.execute(
      `INSERT INTO recurring_transactions 
        (user_id, category_id, description, amount, day_of_month, type, recurrence, next_run, paid, icon) 
       VALUES (?, ?, ?, ?, ?, 'expense', 'monthly', CURDATE(), 0, ?)`,
      [userId, categoryId, description, Math.abs(amount), dayOfMonth, icon || 'default']
    );
    
    console.log("Veritabanı insert sonucu:", result);
    
    // Oluşturulan ödemeyi döndür
    const payment = {
      id: result.insertId,
      name: description,
      category,
      category_id: categoryId,
      amount: Math.abs(amount),
      dueDate: dayOfMonth,
      paid: false,
      icon: icon || (category ? category.toLowerCase() : 'default')
    };
    
    console.log("Döndürülen ödeme nesnesi:", payment);
    
    res.status(201).json({
      status: 'success',
      data: {
        payment
      }
    });
  } catch (error) {
    console.error("addPayment hatası:", error);
    next(error);
  }
};

/**
 * Update a payment status (paid/unpaid)
 * @route PATCH /api/payments/:id/status
 */
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const paymentId = req.params.id;
    const { paid } = req.body;
    
    console.log(`Ödeme durumunu güncelleme: ID=${paymentId}, durum=${paid}`);
    
    if (paid === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide paid status'
      });
    }
    
    // Check if payment exists and belongs to user
    const [payments] = await db.execute(
      'SELECT * FROM recurring_transactions WHERE id = ? AND user_id = ?',
      [paymentId, userId]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }
    
    // Update payment status
    await db.execute(
      'UPDATE recurring_transactions SET paid = ? WHERE id = ? AND user_id = ?',
      [paid ? 1 : 0, paymentId, userId]
    );
    
    console.log("Ödeme durumu güncellendi");
    
    res.status(200).json({
      status: 'success',
      message: 'Payment status updated successfully',
      data: {
        paid
      }
    });
  } catch (error) {
    console.error("updatePaymentStatus hatası:", error);
    next(error);
  }
};

/**
 * Update a payment
 * @route PUT /api/payments/:id
 */
exports.updatePayment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const paymentId = req.params.id;
    const { name, category, amount, dueDate, paid, icon } = req.body;
    
    console.log(`Ödeme güncelleniyor: ID=${paymentId}`, req.body);
    
    // Check if payment exists and belongs to user
    const [payments] = await db.execute(
      'SELECT * FROM recurring_transactions WHERE id = ? AND user_id = ?',
      [paymentId, userId]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }
    
    // Kategori verilmişse, category_id bul veya oluştur
    let categoryId;
    if (category) {
      const [categories] = await db.execute(
        'SELECT id FROM categories WHERE name = ? AND user_id = ?',
        [category, userId]
      );
      
      if (categories.length > 0) {
        categoryId = categories[0].id;
      } else {
        // Kategori yoksa oluştur
        const [result] = await db.execute(
          'INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)',
          [category, 'expense', userId]
        );
        categoryId = result.insertId;
      }
    }
    
    // Update fields
    let updateFields = [];
    let updateParams = [];
    
    if (name) {
      updateFields.push('description = ?');
      updateParams.push(name);
    }
    
    if (categoryId) {
      updateFields.push('category_id = ?');
      updateParams.push(categoryId);
    }
    
    if (amount) {
      updateFields.push('amount = ?');
      updateParams.push(amount);
    }
    
    if (dueDate) {
      updateFields.push('day_of_month = ?');
      updateParams.push(dueDate);
    }
    
    if (paid !== undefined) {
      updateFields.push('paid = ?');
      updateParams.push(paid ? 1 : 0);
    }
    
    if (icon) {
      updateFields.push('icon = ?');
      updateParams.push(icon);
    }
    
    // Exit if no fields to update
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      });
    }
    
    // Build and execute the update query
    updateParams.push(paymentId, userId);
    const query = `UPDATE recurring_transactions SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`;
    console.log("Güncelleme sorgusu:", query);
    console.log("Parametreler:", updateParams);
    
    await db.execute(query, updateParams);
    
    // Get updated payment with category name
    const [updatedPayment] = await db.execute(
      `SELECT rt.id, rt.description as name, rt.category_id, rt.amount, rt.day_of_month, rt.paid, rt.icon,
              c.name as category
       FROM recurring_transactions rt
       LEFT JOIN categories c ON rt.category_id = c.id
       WHERE rt.id = ? AND rt.user_id = ?`,
      [paymentId, userId]
    );
    
    if (updatedPayment.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found after update'
      });
    }
    
    const payment = updatedPayment[0];
    const formattedPayment = {
      id: payment.id,
      name: payment.name,
      category: payment.category,
      category_id: payment.category_id,
      amount: payment.amount,
      dueDate: payment.day_of_month,
      paid: payment.paid === 1, // Convert to boolean
      icon: payment.icon || (payment.category ? payment.category.toLowerCase() : 'default')
    };
    
    console.log("Güncellenmiş ödeme:", formattedPayment);
    
    res.status(200).json({
      status: 'success',
      data: formattedPayment
    });
  } catch (error) {
    console.error("updatePayment hatası:", error);
    next(error);
  }
};

/**
 * Delete a payment
 * @route DELETE /api/payments/:id
 */
exports.deletePayment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const paymentId = req.params.id;
    
    console.log(`Ödeme siliniyor: ID=${paymentId}`);
    
    // Check if payment exists and belongs to user
    const [payments] = await db.execute(
      'SELECT * FROM recurring_transactions WHERE id = ? AND user_id = ?',
      [paymentId, userId]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }
    
    // Delete the payment
    await db.execute(
      'DELETE FROM recurring_transactions WHERE id = ? AND user_id = ?',
      [paymentId, userId]
    );
    
    console.log("Ödeme başarıyla silindi");
    
    res.status(200).json({
      status: 'success',
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error("deletePayment hatası:", error);
    next(error);
  }
};