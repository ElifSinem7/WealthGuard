const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
require('dotenv').config();

const router = express.Router();

// Kullanıcı Girişi (Login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ message: "Geçersiz e-posta veya şifre" });
        }

        const isMatch = await bcrypt.compare(password, user[0].password); // password_hash yerine password kullanıldı
        if (!isMatch) {
            return res.status(400).json({ message: "Geçersiz e-posta veya şifre" });
        }

        const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user[0].id, name: user[0].name, email: user[0].email } });
    } catch (err) {
        console.error(err);
        res.status(500).send("Sunucu hatası");
    }
});

// Kullanıcı Kaydı (Signup)
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Bu e-posta adresi zaten kayıtlı" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);

        res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Sunucu hatası");
    }
});

module.exports = router;
