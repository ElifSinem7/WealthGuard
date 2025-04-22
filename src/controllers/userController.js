const db = require('../config/db');

// 📌 Yeni Kullanıcı Ekle (Sadece Backend'e Kaydet)
exports.createUser = (req, res) => {
  const { name, email } = req.body;

  // Veri doğrulama
  if (!name || !email) {
    return res.status(400).json({ message: 'Geçersiz giriş verisi' });
  }

  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error('Database error: ', err);
      res.status(500).json({ message: 'Kullanıcı eklenemedi', error: err.message });
    } else {
      res.status(201).json({ message: 'Kullanıcı eklendi', userId: result.insertId });
    }
  });
};

// 📌 Kullanıcıları Getir
exports.getUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Database error: ', err);
      res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    } else {
      res.json(results);
    }
  });
};

// 📌 Kullanıcı Güncelle (sadece name ve email güncellenebilir)
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Geçersiz veri' });
  }

  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(sql, [name, email, id], (err, result) => {
    if (err) {
      console.error('Database error: ', err);
      res.status(500).json({ message: 'Güncelleme başarısız', error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    } else {
      res.json({ message: 'Kullanıcı güncellendi' });
    }
  });
};

// 📌 Kullanıcı Sil
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error: ', err);
      res.status(500).json({ message: 'Kullanıcı silinemedi', error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    } else {
      res.json({ message: 'Kullanıcı başarıyla silindi' });
    }
  });
};
