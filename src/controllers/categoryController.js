const Category = require('../models/categoryModel');

const addCategory = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id; // JWT’den gelen kullanıcı ID

    if (!name) return res.status(400).json({ error: 'Category name is required' });

    try {
        const categoryId = await Category.createCategory(userId, name);
        res.status(201).json({ message: 'Category added successfully!', categoryId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding category' });
    }
};

const getUserCategories = async (req, res) => {
    const userId = req.user.id;

    try {
        const categories = await Category.getCategories(userId);
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving categories' });
    }
};

module.exports = { addCategory, getUserCategories };
