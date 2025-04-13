const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const cors = require('cors');
require('dotenv').config();

const router = express.Router();  // express.Router() kullanmalısınız

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

        // JWT Access Token oluşturma
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Süreyi .env'den al
        );

        // JWT Refresh Token oluşturma
        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET, // Refresh token için farklı bir secret
            { expiresIn: '30d' } // Refresh token süresi
        );

        res.json({
            message: "Giriş başarılı",
            token, // Access token
            refreshToken, // Refresh token
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

            // Refresh token da oluşturulacak
            const refreshToken = jwt.sign(
                { userId: newUsers[0].id },
                process.env.JWT_REFRESH_SECRET, // Refresh token için farklı bir secret
                { expiresIn: '30d' }
            );

            return res.status(201).json({
                message: "Kullanıcı başarıyla kaydedildi",
                token,
                refreshToken,
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

// Refresh Token ile Yeni Access Token Almak
router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token gerekli" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Geçersiz refresh token" });
        }

        // Yeni access token oluşturma
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Yeni access token süresi
        );

        res.json({ token: newAccessToken });
    });
});

// Kullanıcı Çıkışı (Logout) - Client tarafında token'ı silmek yeterlidir
router.post('/logout', (req, res) => {
    res.json({ message: "Başarıyla çıkış yapıldı" });
});

module.exports = router;
