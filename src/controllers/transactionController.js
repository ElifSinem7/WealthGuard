const Transaction = require('../models/transactionModel');

const createTransaction = async (req, res) => {
    try {
        const { category_id, amount, transaction_date, description } = req.body;
        const user_id = req.user.id; // JWT’den gelen kullanıcı ID

        if (!category_id || !amount || !transaction_date) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const transactionId = await Transaction.addTransaction(user_id, category_id, amount, transaction_date, description);
        res.status(201).json({ message: 'Transaction added successfully', transactionId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
};

const getUserTransactions = async (req, res) => {
    try {
        const user_id = req.user.id;
        const transactions = await Transaction.getUserTransactions(user_id);
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not retrieve transactions' });
    }
};

module.exports = { createTransaction, getUserTransactions };
