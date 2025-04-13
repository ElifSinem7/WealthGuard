const cron = require('node-cron');
const db = require('../config/db');

// Recurring işlemi çalıştıran fonksiyon
async function runRecurringTransactions() {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log(`🔁 Checking recurring transactions for: ${today}`);

    const [rows] = await db.query(
      "SELECT * FROM recurring_transactions WHERE next_run = ?",
      [today]
    );

    for (const trx of rows) {
      await db.query(
        "INSERT INTO transactions (user_id, type, amount, category, description, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
        [trx.user_id, trx.type, trx.amount, trx.category, trx.description]
      );

      const nextRun = new Date();
      nextRun.setMonth(nextRun.getMonth() + 1);
      nextRun.setDate(trx.day_of_month);
      const formattedNextRun = nextRun.toISOString().split('T')[0];

      await db.query(
        "UPDATE recurring_transactions SET next_run = ? WHERE id = ?",
        [formattedNextRun, trx.id]
      );

      console.log(`✅ Auto transaction added for user #${trx.user_id}`);
    }

    if (rows.length === 0) {
      console.log("ℹ️ No recurring transactions due today.");
    }
  } catch (err) {
    console.error("❌ Cron job failed:", err.message);
  }
}

// Cron job'u başlat
cron.schedule('0 * * * *', runRecurringTransactions);

// Export et ki manuel çalıştırabilelim
module.exports = runRecurringTransactions;
