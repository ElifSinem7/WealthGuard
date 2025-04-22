const express = require("express");
const router = express.Router();
const db = require("../config/db"); // db bağlantısı varsa

// Kullanıcıyı veritabanına ekle
router.post("/user", async (req, res) => {
  const { userId, email, name, fcmToken } = req.body;

  try {
    await db.query(
      "INSERT INTO users (id, email, name, fcm_token) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE fcm_token = ?",
      [userId, email, name, fcmToken, fcmToken]
    );
    res.status(201).json({ message: "User saved successfully" });
  } catch (err) {
    console.error("User save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
