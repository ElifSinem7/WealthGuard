const express = require('express');
const router = express.Router();
const pool = require('../../config/db');

// Yeni kategori ekleme
router.post('/', async (req, res) => {
    const { name } = req.body; // Kategori adı

    try {
        const result = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Kategori başarıyla eklendi!', categoryId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kategori eklenirken hata oluştu!' });
    }
});

module.exports = router;
