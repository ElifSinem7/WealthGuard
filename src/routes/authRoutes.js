const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
const cors = require('cors');
require('dotenv').config();

const router = express.Router();

// CORS Middleware
router.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

// Kullanıcı Girişi (Login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "E-posta ve şifre gereklidir" });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (!users.length) {
            return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
        }

        // JWT Token oluşturma
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Süreyi .env'den al
        );

        res.json({
            message: "Giriş başarılı",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
});

// Kullanıcı Kaydı (Signup)
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: "Tüm alanlar gereklidir" });
    }

    try {
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Bu e-posta adresi zaten kayıtlı" });
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            [email, hashedPassword, name]
        );

        if (result.affectedRows === 1) {
            const [newUsers] = await pool.query('SELECT id, name, email FROM users WHERE email = ?', [email]);
            const token = jwt.sign(
                { userId: newUsers[0].id, email: newUsers[0].email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
            );

            return res.status(201).json({
                message: "Kullanıcı başarıyla kaydedildi",
                token,
                user: newUsers[0]
            });
        } else {
            return res.status(500).json({ message: "Kullanıcı kaydedilemedi" });
        }
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
});

// Kullanıcı Çıkışı (Logout) - Client tarafında token'ı silmek yeterlidir
router.post('/logout', (req, res) => {
    res.json({ message: "Başarıyla çıkış yapıldı" });
});

module.exports = router;
