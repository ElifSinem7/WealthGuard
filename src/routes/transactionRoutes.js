const express = require('express');
const pool = require('../../config/db'); // Veritabanı bağlantısı
const router = express.Router();

// Transaction ekleme route'u
router.post('/add', async (req, res) => {
  const { user_id, category_id, amount, description, transaction_date } = req.body;

  // Verilerin doğruluğunu kontrol et
  if (!user_id || !category_id || !amount || !transaction_date) {
    return res.status(400).json({ message: "Eksik veri, tüm alanları doldurduğunuzdan emin olun." });
  }

  try {
    // Transaction ekleme sorgusu
    const query = `INSERT INTO transactions (user_id, category_id, amount, description, transaction_date) 
                   VALUES (?, ?, ?, ?, ?)`;
    
    const [result] = await pool.query(query, [user_id, category_id, amount, description, transaction_date]);

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
