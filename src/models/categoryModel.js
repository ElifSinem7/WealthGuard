const db = require('../config/db');

const createCategory = async (name, type) => {
    if (!name || !type) {
        throw new Error("Category name and type (income/expense) are required.");
    }

    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type)) {
        throw new Error("Invalid category type. Must be 'income' or 'expense'.");
    }

    const [result] = await db.execute(
        'INSERT INTO categories (name, type) VALUES (?, ?)', 
        [name, type]
    );
    
    return result.insertId;
};

const getCategories = async () => {
    const [categories] = await db.execute(
        'SELECT * FROM categories'
    );
    return categories;
};

module.exports = { createCategory, getCategories };
