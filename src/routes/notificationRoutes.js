const express = require('express');
const router = express.Router();
const admin = require('../config/firebase'); // Firebase Admin SDK
const Notification = require('../models/notificationModel'); // In-App bildirim modeli
const db = require('../config/db'); // Veritabanı bağlantısı

// 🔐 FCM Token kaydetme: POST /api/notifications/save-fcm-token
router.post('/save-fcm-token', async (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ message: 'Eksik bilgi: userId ve token zorunlu.' });
  }

  try {
    await db.execute('UPDATE users SET fcm_token = ? WHERE id = ?', [token, userId]);
    console.log(`🔐 Token kaydedildi: ${userId} -> ${token}`);
    res.status(200).json({ message: 'Token başarıyla kaydedildi' });
  } catch (error) {
    console.error('❌ Token kaydedilirken hata:', error);
    res.status(500).json({ message: 'Token kaydedilemedi' });
  }
});

// 📤 Bildirim gönderme: POST /api/notifications/send
router.post('/send', async (req, res) => {
  const { userId, title, body } = req.body;

  if (!userId || !title || !body) {
    return res.status(400).json({ success: false, message: 'userId, title ve body alanları zorunludur' });
  }

  try {
    const [rows] = await db.execute('SELECT fcm_token FROM users WHERE id = ?', [userId]);

    if (rows.length === 0 || !rows[0].fcm_token) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı veya FCM token yok' });
    }

    const token = rows[0].fcm_token;

    const message = {
      notification: { title, body },
      token: token,
    };

    await admin.messaging().send(message);
    console.log(`✅ Bildirim gönderildi: ${title} -> ${userId}`);

    // In-App bildirimi de kaydet
    await Notification.create({
      userId,
      title,
      body,
      date: new Date(),
    });

    res.json({ success: true, message: 'Bildirim gönderildi ve kaydedildi.' });
  } catch (error) {
    console.error('❌ Bildirim gönderme hatası:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
