const express = require('express');
const paymentController = require('../controllers/paymentController');
const authenticateUser = require('../middleware/auth'); // Doğrudan fonksiyon olarak import et

const router = express.Router();

// Tüm rotaları authenticateUser middleware'i ile koru
router.use(authenticateUser);

// CRUD işlemleri
router.route('/')
  .get(paymentController.getPayments)  // getPayment yerine getPayments
  .post(paymentController.addPayment);

router.route('/:id')
  .get(paymentController.getPaymentById)  // getPaymentId yerine getPaymentById
  .put(paymentController.updatePayment)
  .delete(paymentController.deletePayment);

// Ödeme durumu güncelleme
router.patch('/:id/status', paymentController.updatePaymentStatus);

module.exports = router;