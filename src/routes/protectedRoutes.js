const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Middleware'i çağır

// Korunan bir rota
router.get('/protected-route', authMiddleware, (req, res) => {
    res.json({ message: "Bu özel bir içerik, erişimin var!" });
});

module.exports = router;
