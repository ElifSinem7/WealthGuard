const db = require('../config/db');

const addTransaction = async (user_id, category_id, amount, transaction_date, description) => {
    const [result] = await db.execute(
        'INSERT INTO transactions (user_id, category_id, amount, transaction_date, description) VALUES (?, ?, ?, ?, ?)',
        [user_id, category_id, amount, transaction_date, description]
    );
    return result.insertId;
};

const getUserTransactions = async (user_id) => {
    const [transactions] = await db.execute(
        'SELECT t.*, c.name AS category_name FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.user_id = ?',
        [user_id]
    );
    return transactions;
};

module.exports = { addTransaction, getUserTransactions };
