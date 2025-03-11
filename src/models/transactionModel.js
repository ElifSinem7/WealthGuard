const db = require('../config/db');

const addTransaction = async (user_id, category_id, amount, transaction_date) => {
    const [result] = await db.execute(
        'INSERT INTO transactions (user_id, category_id, amount, transaction_date) VALUES (?, ?, ?, ?)',
        [user_id, category_id, amount, transaction_date]
    );
    return result;
};

module.exports = { addTransaction };
