const express = require('express');
const router = express.Router();
const { addCategory, getUserCategories } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');

// Yeni kategori ekleme (Sadece giriş yapmış kullanıcılar ekleyebilir)
router.post('/', authMiddleware, addCategory);

// Kullanıcının tüm kategorilerini listeleme
router.get('/', authMiddleware, getUserCategories);

module.exports = router;
