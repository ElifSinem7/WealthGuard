const express = require('express');
const router = express.Router();
const db = require('../config/db');
const runRecurringTransactions = require('../cron/recurringTransactions'); // cron fonksiyonunu import ediyoruz

// 1️⃣: Tüm recurring işlemleri getir (userId bazlı)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM recurring_transactions WHERE user_id = ? ORDER BY next_run ASC",
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Get recurring error:", error);
    res.status(500).json({ error: "Failed to fetch recurring transactions" });
  }
});

// 2️⃣: Yeni recurring işlem ekle
router.post('/', async (req, res) => {
  try {
    const { user_id, type, amount, category, description, day_of_month } = req.body;

    const today = new Date();
    const nextRun = new Date();
    nextRun.setMonth(today.getMonth() + 1);
    nextRun.setDate(day_of_month);
    const formattedNextRun = nextRun.toISOString().split('T')[0];

    await db.query(
      "INSERT INTO recurring_transactions (user_id, type, amount, category, description, day_of_month, next_run) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user_id, type, amount, category, description, day_of_month, formattedNextRun]
    );

    res.json({ message: "Recurring transaction added" });
  } catch (error) {
    console.error("Add recurring error:", error);
    res.status(500).json({ error: "Failed to add recurring transaction" });
  }
});

// 3️⃣: Recurring işlemleri çalıştır (manuel tetikleme)
router.post('/run', async (req, res) => {
  try {
    await runRecurringTransactions(); // cron fonksiyonunu çağır
    res.json({ message: "Recurring transactions executed" });
  } catch (error) {
    console.error("Run recurring error:", error);
    res.status(500).json({ error: "Failed to run recurring transactions" });
  }
});

module.exports = router;
