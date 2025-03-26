const Category = require('../models/categoryModel');

const addCategory = async (req, res) => {
    try {
        const { name, type } = req.body;
        const userId = req.user ? req.user.id : null; // Eğer userId varsa al, yoksa null bırak

        if (!name || !type) {
            return res.status(400).json({ error: 'Category name and type (income/expense) are required' });
        }

        const validTypes = ["income", "expense"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: "Invalid category type. Must be 'income' or 'expense'." });
        }

        const categoryId = await Category.createCategory(name, type, userId);
        res.status(201).json({ message: 'Category added successfully!', categoryId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Error adding category' });
    }
};

const getUserCategories = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const categories = await Category.getCategories(userId);
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving categories' });
    }
};

module.exports = { addCategory, getUserCategories };
