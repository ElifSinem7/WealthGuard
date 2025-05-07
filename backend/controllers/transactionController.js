const db = require('../config/database');

/**
 * Get all transactions for the authenticated user
 * @route GET /api/transactions
 */
exports.getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get query parameters for filtering
    const { 
      startDate, 
      endDate, 
      type, 
      category, 
      limit = 50,
      offset = 0,
      sortBy = 'transaction_date',
      sortOrder = 'DESC'
    } = req.query;
    
    // Base query
    let query = `
    SELECT t.id, t.amount, t.description, t.transaction_date, 
           c.name as category, c.type as type, c.id as category_id
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
  `;
  
    // Create array to hold parameters
    const queryParams = [userId];
    
    // Add filters if provided
    if (startDate) {
      query += ' AND t.transaction_date >= ?';
      queryParams.push(startDate);
    }
    
    if (endDate) {
      query += ' AND t.transaction_date <= ?';
      queryParams.push(endDate);
    }
    
    if (type) {
      query += ' AND c.type = ?';
      queryParams.push(type);
    }
    
    if (category) {
      query += ' AND c.name = ?';
      queryParams.push(category);
    }
    
    // Add ordering
    query += ` ORDER BY t.${sortBy} ${sortOrder}`;

    
    // Add pagination
    query += ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    
    // Execute query
    const [transactions] = await db.execute(query, queryParams);
    
    // Format the response
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      name: transaction.description,
      category: transaction.category,
      amount: transaction.type === 'expense' ? -Math.abs(transaction.amount) : transaction.amount,
      date: transaction.transaction_date,
      type: transaction.type,
      category_id: transaction.category_id,
      icon: transaction.category.toLowerCase()
    }));
    
    res.status(200).json({
      status: 'success',
      count: formattedTransactions.length,
      data: formattedTransactions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single transaction by ID
 * @route GET /api/transactions/:id
 */
exports.getTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;
    
    const [transactions] = await db.execute(
      `SELECT t.id, t.amount, t.description, t.transaction_date, 
              c.name as category, c.type as type, c.id as category_id
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? AND t.id = ?`,
      [userId, transactionId]
    );
    
    if (transactions.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }
    
    const transaction = transactions[0];
    
    // Format the response
    const formattedTransaction = {
      id: transaction.id,
      name: transaction.description,
      category: transaction.category,
      amount: transaction.type === 'expense' ? -Math.abs(transaction.amount) : transaction.amount,
      date: transaction.transaction_date,
      type: transaction.type,
      category_id: transaction.category_id,
      icon: transaction.category.toLowerCase()
    };
    
    res.status(200).json({
      status: 'success',
      data: formattedTransaction
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new transaction
 * @route POST /api/transactions
 */
exports.createTransaction = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('❌ req.user undefined:', req.user);
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: No user info found in request'
      });
    }

    const userId = req.user.id;
    const { name, category, amount, date, type, note } = req.body;

    if (!name || !category || !amount || !date || !type) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, category, amount, date, and type'
      });
    }

    console.log('✅ POST /api/transactions');
    console.log('User ID:', userId);
    console.log('Payload:', req.body);

    let [categories] = await db.execute(
      'SELECT id FROM categories WHERE name = ? AND user_id = ?',
      [category, userId]
    );

    let categoryId;
    if (categories.length === 0) {
      const [result] = await db.execute(
        'INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)',
        [category, type, userId]
      );
      categoryId = result.insertId;
    } else {
      categoryId = categories[0].id;
    }

    const absAmount = Math.abs(amount);
    const [result] = await db.execute(
      'INSERT INTO transactions (user_id, category_id, amount, description, transaction_date) VALUES (?, ?, ?, ?, ?)',
      [userId, categoryId, absAmount, name, date]
    );

    const transaction = {
      id: result.insertId,
      name,
      category,
      amount: type === 'expense' ? -absAmount : absAmount,
      date,
      type,
      note: note || '',
      icon: category.toLowerCase()
    };

    res.status(201).json({
      status: 'success',
      data: transaction
    });
  } catch (error) {
    console.error('❌ Error in createTransaction:', error);
    next(error);
  }
};
exports.updateTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;
    const { name, category, amount, date, type, note } = req.body;
    
    // Check if transaction exists and belongs to user
    const [transactions] = await db.execute(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, userId]
    );
    
    if (transactions.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }
    
    // Get or create the category
    let categoryId;
    
    if (category) {
      let [categories] = await db.execute(
        'SELECT id FROM categories WHERE name = ? AND user_id = ?',
        [category, userId]
      );
      
      if (categories.length === 0) {
        // Create the category if it doesn't exist
        const [result] = await db.execute(
          'INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)',
          [category, type, userId]
        );
        categoryId = result.insertId;
      } else {
        categoryId = categories[0].id;
      }
    }
    
    // Update the transaction
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
      updateParams.push(Math.abs(amount));
    }
    
    if (date) {
      updateFields.push('transaction_date = ?');
      updateParams.push(date);
    }
    
    // Exit if no fields to update
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      });
    }
    
    // Build and execute the update query
    updateParams.push(transactionId, userId);
    await db.execute(
      `UPDATE transactions SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
      updateParams
    );
    
    // Get updated transaction
    const [updatedTransaction] = await db.execute(
      `SELECT t.id, t.amount, t.description, t.transaction_date, 
              c.name as category, c.type as type
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.id = ? AND t.user_id = ?`,
      [transactionId, userId]
    );
    
    if (updatedTransaction.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found after update'
      });
    }
    
    // Format the response
    const transaction = updatedTransaction[0];
    const formattedTransaction = {
      id: transaction.id,
      name: transaction.description,
      category: transaction.category,
      amount: transaction.type === 'expense' ? -Math.abs(transaction.amount) : transaction.amount,
      date: transaction.transaction_date,
      type: transaction.type,
      note: note || '',
      icon: transaction.category.toLowerCase()
    };
    
    res.status(200).json({
      status: 'success',
      data: formattedTransaction
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a transaction
 * @route DELETE /api/transactions/:id
 */
exports.deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;
    
    // Check if transaction exists and belongs to user
    const [transactions] = await db.execute(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, userId]
    );
    
    if (transactions.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }
    
    // Delete the transaction
    await db.execute(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, userId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transaction statistics
 * @route GET /api/transactions/stats
 */
exports.getTransactionStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { period = 'month' } = req.query;
    
    let dateFilter;
    const now = new Date();
    
    // Set date filter based on period
    switch (period) {
      case 'week':
        // Last 7 days
        dateFilter = new Date(now);
        dateFilter.setDate(now.getDate() - 7);
        break;
      case 'month':
        // Current month
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        // Current year
        dateFilter = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        // Default to current month
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    const formattedDate = dateFilter.toISOString().split('T')[0];
    
    // Get income sum
    const [incomeResult] = await db.execute(
      `SELECT SUM(t.amount) as total
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? AND c.type = 'income' AND t.transaction_date >= ?`,
      [userId, formattedDate]
    );
    
    // Get expense sum
    const [expenseResult] = await db.execute(
      `SELECT SUM(t.amount) as total
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? AND c.type = 'expense' AND t.transaction_date >= ?`,
      [userId, formattedDate]
    );
    
    // Get category breakdown
    const [categoryBreakdown] = await db.execute(
      `SELECT c.name, c.type, SUM(t.amount) as total
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? AND t.transaction_date >= ?
       GROUP BY c.name, c.type
       ORDER BY total DESC`,
      [userId, formattedDate]
    );
    
    const income = incomeResult[0].total || 0;
    const expenses = expenseResult[0].total || 0;
    const balance = income - expenses;
    
    res.status(200).json({
      status: 'success',
      data: {
        income,
        expenses,
        balance,
        categories: categoryBreakdown.map(item => ({
          name: item.name,
          type: item.type,
          amount: item.total
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};