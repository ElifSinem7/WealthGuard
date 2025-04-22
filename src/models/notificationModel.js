const pool = require('../config/db'); // Veritabanı bağlantısı

// Yeni bir bildirim eklemek için model
const createNotification = async (userId, body) => {
  try {
    const query = `INSERT INTO notifications (user_id, body, created_at) VALUES (?, ?, NOW())`;

    const [result] = await pool.query(query, [userId, body]);
    
    return result.insertId; // Eklendiğinde bildirim ID'sini döndürür
  } catch (error) {
    console.error('Bildirim veritabanına kaydedilirken hata:', error);
    throw error;
  }
};

// Kullanıcıya ait bildirimleri almak için model
const getNotificationsByUserId = async (userId) => {
  try {
    const query = `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`;
    const [notifications] = await pool.query(query, [userId]);

    return notifications;
  } catch (error) {
    console.error('Bildirimler alınırken hata:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getNotificationsByUserId
};
