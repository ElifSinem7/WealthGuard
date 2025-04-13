const db = require('../config/db');

const Notification = {
  // 🔔 Yeni bir bildirimi veritabanına kaydet
  create: async ({ userId, title, body }) => {
    try {
      const query = `
        INSERT INTO notifications (user_id, title, body, created_at)
        VALUES (?, ?, ?, NOW())
      `;
      await db.execute(query, [userId, title, body]);
    } catch (error) {
      console.error("❌ Bildirim veritabanına kaydedilirken hata:", error);
      throw error;
    }
  },

  // 📩 Kullanıcının tüm bildirimlerini getir
  getByUserId: async (userId) => {
    try {
      const query = `
        SELECT id, title, body, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
      `;
      const [rows] = await db.execute(query, [userId]);
      return rows;
    } catch (error) {
      console.error("❌ Kullanıcı bildirimleri alınırken hata:", error);
      throw error;
    }
  },
};

module.exports = Notification;
