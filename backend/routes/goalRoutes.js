const express = require('express');
const goalController = require('../controllers/goalController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all goal routes
router.use(authMiddleware);

// CRUD operations
router.route('/')
  .get(goalController.getAllGoals)
  .post(goalController.addGoal);

router.route('/:id')
  .get(goalController.getGoal)
  .put(goalController.updateGoal)
  .delete(goalController.deleteGoal);

// Add money to goal
router.patch('/:id/add-money', goalController.addMoneyToGoal);

module.exports = router;