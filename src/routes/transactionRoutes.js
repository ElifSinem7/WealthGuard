const express = require('express');
const pool = require('../config/db'); // Veritabanı bağlantısı
const router = express.Router();

// Transaction ekleme route'u
router.post('/', async (req, res) => {
  const { user_id, category_id, amount, description, transaction_date } = req.body;

  // Verilerin doğruluğunu kontrol et
  if (!user_id || !category_id || !amount || !transaction_date) {
    return res.status(400).json({ message: "Eksik veri, tüm alanları doldurduğunuzdan emin olun." });
  }

  // Tarih formatını kontrol et
  const validDate = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD formatı
  if (!validDate.test(transaction_date)) {
    return res.status(400).json({ message: 'Geçersiz tarih formatı.' });
  }

  try {
    // Kullanıcı ID kontrolü
    const userCheckQuery = 'SELECT * FROM users WHERE id = ?';
    const [userResult] = await pool.query(userCheckQuery, [user_id]);
    if (userResult.length === 0) {
      return res.status(400).json({ message: 'Geçersiz kullanıcı ID.' });
    }

    // Kategori ID kontrolü
    const categoryCheckQuery = 'SELECT * FROM categories WHERE id = ?';
    const [categoryResult] = await pool.query(categoryCheckQuery, [category_id]);
    if (categoryResult.length === 0) {
      return res.status(400).json({ message: 'Geçersiz kategori ID.' });
    }

    // Transaction ekleme sorgusu
    const query = `INSERT INTO transactions (user_id, category_id, amount, description, transaction_date) 
                   VALUES (?, ?, ?, ?, ?)`;
    
    const [result] = await pool.query(query, [
      user_id, 
      category_id, 
      amount, 
      description || null,  // Eğer description boşsa NULL olarak ekle
      transaction_date
    ]);

    // Başarılı ekleme sonrası cevap gönder
    res.status(201).json({
      message: 'Transaction başarıyla eklendi!',
      transaction: {
        id: result.insertId,
        user_id,
        category_id,
        amount,
        description,
        transaction_date
      }
    });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ message: "Sunucu hatası, lütfen tekrar deneyin." });
  }
});

module.exports = router;
