const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticateUser = require('../middleware/auth');

// Tüm rotaları korumalı yap
router.use(authenticateUser);

// İstatistikler rotası - bu özel rota diğer parametreli rotalardan ÖNCE tanımlanmalı
router.get('/stats', transactionController.getTransactionStats);

// Ana işlem rotaları
router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);
router.get('/:id', transactionController.getTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;