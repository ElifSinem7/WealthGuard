// models/recurringModel.js

const db = require('../config/db');

const RecurringModel = {
  // Kullanıcının tüm recurring işlemlerini getir
  getAllByUserId: async (userId) => {
    const [rows] = await db.query(
      "SELECT * FROM recurring_transactions WHERE user_id = ? ORDER BY next_run ASC",
      [userId]
    );
    return rows;
  },

  // Yeni bir recurring işlem ekle
  create: async ({ user_id, type, amount, category, description, day_of_month, next_run }) => {
    return db.query(
      "INSERT INTO recurring_transactions (user_id, type, amount, category, description, day_of_month, next_run) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user_id, type, amount, category, description, day_of_month, next_run]
    );
  },

  // Belirli bir tarihe ait recurring işlemleri getir (cron için)
  getDueTransactions: async (today) => {
    const [rows] = await db.query(
      "SELECT * FROM recurring_transactions WHERE next_run = ?",
      [today]
    );
    return rows;
  },

  // next_run güncelle
  updateNextRun: async (id, newDate) => {
    return db.query(
      "UPDATE recurring_transactions SET next_run = ? WHERE id = ?",
      [newDate, id]
    );
  }
};

module.exports = RecurringModel;
