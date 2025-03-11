const db = require('../config/db');

// 📌 Kullanıcıları Getir
exports.getUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Sunucu hatası' });
    } else {
      res.json(results);
    }
  });
};

// 📌 Yeni Kullanıcı Ekle
exports.createUser = (req, res) => {
  const { name, email, balance } = req.body;
  const sql = 'INSERT INTO users (name, email, balance) VALUES (?, ?, ?)';
  
  db.query(sql, [name, email, balance], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Kullanıcı eklenemedi' });
    } else {
      res.status(201).json({ message: 'Kullanıcı eklendi', userId: result.insertId });
    }
  });
};

// 📌 Kullanıcı Güncelle
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { balance } = req.body;
  const sql = 'UPDATE users SET balance = ? WHERE id = ?';
  
  db.query(sql, [balance, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Güncelleme başarısız' });
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
      console.error(err);
      res.status(500).json({ message: 'Kullanıcı silinemedi' });
    } else {
      res.json({ message: 'Kullanıcı başarıyla silindi' });
    }
  });
};
