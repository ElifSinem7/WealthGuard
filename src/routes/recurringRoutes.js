const express = require('express');
const router = express.Router();
const db = require('../../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM recurring_transactions');
    res.json(rows);
  } catch (err) {
    console.error('❌ Recurring API error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
