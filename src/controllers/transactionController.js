const Transaction = require('../models/transactionModel');

const createTransaction = async (req, res) => {
    try {
        const { user_id, category_id, amount, transaction_date } = req.body;
        const result = await Transaction.addTransaction(user_id, category_id, amount, transaction_date);
        res.status(201).json({ message: 'Transaction added successfully', transactionId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTransaction };
