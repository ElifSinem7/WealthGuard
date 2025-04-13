const admin = require('../config/firebase');  // Firebase Admin SDK
const Notification = require('../models/notificationModel');  // Notification model (MySQL için)
const db = require('../config/db');  // MySQL bağlantısı

// 📤 Kullanıcıya FCM bildirimi gönder ve veritabanına kaydet
exports.sendNotification = async (req, res) => {
  const { userId, title, body } = req.body;

  // Giriş doğrulama
  if (!userId || !title || !body) {
    return res.status(400).json({ success: false, message: 'Eksik parametreler: userId, title, body gereklidir' });
  }

  try {
    // ✅ Kullanıcının FCM token'ını çek
    const [rows] = await db.execute('SELECT fcm_token FROM users WHERE id = ?', [userId]);
    if (rows.length === 0 || !rows[0].fcm_token) {
      return res.status(404).json({ success: false, message: 'Kullanıcı veya FCM token bulunamadı' });
    }

    const token = rows[0].fcm_token;

    // 🔔 Firebase mesaj nesnesi
    const message = {
      notification: { title, body },
      token: token
    };

    // 🚀 Bildirimi gönder
    const response = await admin.messaging().send(message);
    console.log("📨 Bildirim gönderildi:", response);

    // 💾 Veritabanına bildirimi kaydet
    await Notification.create({
      userId,
      title,
      body,
      date: new Date()
    });

    res.status(200).json({ success: true, message: 'Bildirim başarıyla gönderildi ve kaydedildi.' });

  } catch (error) {
    console.error("❌ Bildirim hatası:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🧾 Kullanıcının önceki bildirimlerini getir
exports.getUserNotifications = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'Kullanıcı ID eksik' });
  }

  try {
    const notifications = await Notification.getByUserId(userId);
    res.json({ success: true, notifications });
  } catch (error) {
    console.error("❌ Bildirim alma hatası:", error);
    res.status(500).json({ success: false, message: 'Bildirimler alınamadı', error: error.message });
  }
};
