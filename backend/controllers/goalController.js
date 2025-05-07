const db = require('../config/database');

/**
 * Get all savings goals for the authenticated user
 * @route GET /api/goals
 */
exports.getAllGoals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const [goals] = await db.execute(
      `SELECT id, goal_name as name, current_amount as current, target_amount as target
       FROM savings_goals
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    
    res.status(200).json({
      status: 'success',
      count: goals.length,
      data: goals
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single savings goal by ID
 * @route GET /api/goals/:id
 */
exports.getGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    
    const [goals] = await db.execute(
      `SELECT id, goal_name as name, current_amount as current, target_amount as target
       FROM savings_goals
       WHERE user_id = ? AND id = ?`,
      [userId, goalId]
    );
    
    if (goals.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings goal not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: goals[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new savings goal
 * @route POST /api/goals
 */
exports.addGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, target, current = 0 } = req.body;
    
    // Input validation
    if (!name || !target) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name and target amount'
      });
    }
    
    // Insert the goal
    const [result] = await db.execute(
      `INSERT INTO savings_goals (user_id, goal_name, current_amount, target_amount)
       VALUES (?, ?, ?, ?)`,
      [userId, name, current, target]
    );
    
    // Return the created goal
    const goal = {
      id: result.insertId,
      name,
      current,
      target
    };
    
    res.status(201).json({
      status: 'success',
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a savings goal
 * @route PUT /api/goals/:id
 */
exports.updateGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    const { name, target, current } = req.body;
    
    // Check if goal exists and belongs to user
    const [goals] = await db.execute(
      'SELECT * FROM savings_goals WHERE id = ? AND user_id = ?',
      [goalId, userId]
    );
    
    if (goals.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings goal not found'
      });
    }
    
    // Update fields
    let updateFields = [];
    let updateParams = [];
    
    if (name) {
      updateFields.push('goal_name = ?');
      updateParams.push(name);
    }
    
    if (target) {
      updateFields.push('target_amount = ?');
      updateParams.push(target);
    }
    
    if (current !== undefined) {
      updateFields.push('current_amount = ?');
      updateParams.push(current);
    }
    
    // Exit if no fields to update
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      });
    }
    
    // Build and execute the update query
    updateParams.push(goalId, userId);
    await db.execute(
      `UPDATE savings_goals SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
      updateParams
    );
    
    // Get updated goal
    const [updatedGoal] = await db.execute(
      `SELECT id, goal_name as name, current_amount as current, target_amount as target
       FROM savings_goals
       WHERE id = ? AND user_id = ?`,
      [goalId, userId]
    );
    
    if (updatedGoal.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings goal not found after update'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: updatedGoal[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add money to a savings goal
 * @route PATCH /api/goals/:id/add-money
 */
exports.addMoneyToGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a positive amount'
      });
    }
    
    // Check if goal exists and belongs to user
    const [goals] = await db.execute(
      'SELECT * FROM savings_goals WHERE id = ? AND user_id = ?',
      [goalId, userId]
    );
    
    if (goals.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings goal not found'
      });
    }
    
    // Update current amount
    await db.execute(
      'UPDATE savings_goals SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?',
      [amount, goalId, userId]
    );
    
    // Get updated goal
    const [updatedGoal] = await db.execute(
      `SELECT id, goal_name as name, current_amount as current, target_amount as target
       FROM savings_goals
       WHERE id = ? AND user_id = ?`,
      [goalId, userId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Money added to goal successfully',
      data: updatedGoal[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a savings goal
 * @route DELETE /api/goals/:id
 */
exports.deleteGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    
    // Check if goal exists and belongs to user
    const [goals] = await db.execute(
      'SELECT * FROM savings_goals WHERE id = ? AND user_id = ?',
      [goalId, userId]
    );
    
    if (goals.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings goal not found'
      });
    }
    
    // Delete the goal
    await db.execute(
      'DELETE FROM savings_goals WHERE id = ? AND user_id = ?',
      [goalId, userId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Savings goal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};