const express = require('express');
const router = express.Router();
const { sendNotification } = require('../controllers/notificationController');  // Controller'ı import ediyoruz

// Transaction eklendiğinde bildirim gönderme
router.post('/send', sendNotification);  // Socket.io ile bildirim gönderme işini controller'a yönlendiriyoruz

module.exports = router;
