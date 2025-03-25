const db = require('../../config/db');

const createCategory = async (user_id, name) => {
    const [result] = await db.execute('INSERT INTO categories (user_id, name) VALUES (?, ?)', [user_id, name]);
    return result.insertId;
};

const getCategories = async (user_id) => {
    const [categories] = await db.execute('SELECT * FROM categories WHERE user_id = ?', [user_id]);
    return categories;
};

module.exports = { createCategory, getCategories };
