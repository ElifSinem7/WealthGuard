const express = require('express');
const settingController = require('../controllers/settingController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all settings routes
router.use(authMiddleware);

// Get and update settings
router.route('/')
  .get(settingController.getSettings)
  .put(settingController.updateSettings);

// Update profile
router.put('/profile', settingController.updateProfile);

// Reset password
router.post('/reset-password', settingController.resetPassword);

module.exports = router;