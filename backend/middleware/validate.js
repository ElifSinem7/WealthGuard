const { validationResult, check } = require('express-validator');

/**
 * Middleware to validate request inputs
 * @param {Array} validations - Array of express-validator validations
 * @returns {Function} Middleware function
 */
exports.validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Get validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors
    const extractedErrors = errors.array().map(err => ({
      [err.param]: err.msg
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: extractedErrors
    });
  };
};

/**
 * Common validation rules
 */
exports.rules = {
  // Auth validations
  auth: {
    register: [
      check('name').trim().not().isEmpty().withMessage('Name is required'),
      check('email').isEmail().withMessage('Please provide a valid email address'),
      check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    
    login: [
      check('email').isEmail().withMessage('Please provide a valid email address'),
      check('password').not().isEmpty().withMessage('Password is required')
    ],
    
    resetPassword: [
      check('email').isEmail().withMessage('Please provide a valid email address')
    ]
  },
  
  // Transaction validations
  transaction: {
    create: [
      check('name').trim().not().isEmpty().withMessage('Transaction name is required'),
      check('amount').isNumeric().withMessage('Amount must be a number'),
      check('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
      check('date').isDate().withMessage('Please provide a valid date')
    ],
    
    update: [
      check('name').optional().trim().not().isEmpty().withMessage('Transaction name cannot be empty'),
      check('amount').optional().isNumeric().withMessage('Amount must be a number'),
      check('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
      check('date').optional().isDate().withMessage('Please provide a valid date')
    ]
  },
  
  // Payment validations
  payment: {
    create: [
      check('name').trim().not().isEmpty().withMessage('Payment name is required'),
      check('amount').isNumeric().withMessage('Amount must be a number'),
      check('dueDate').isInt({ min: 1, max: 31 }).withMessage('Due date must be between 1 and 31'),
      check('category').trim().not().isEmpty().withMessage('Category is required')
    ],
    
    update: [
      check('name').optional().trim().not().isEmpty().withMessage('Payment name cannot be empty'),
      check('amount').optional().isNumeric().withMessage('Amount must be a number'),
      check('dueDate').optional().isInt({ min: 1, max: 31 }).withMessage('Due date must be between 1 and 31')
    ],
    
    updateStatus: [
      check('paid').isBoolean().withMessage('Paid status must be true or false')
    ]
  },
  
  // Goal validations
  goal: {
    create: [
      check('name').trim().not().isEmpty().withMessage('Goal name is required'),
      check('target').isNumeric().withMessage('Target amount must be a number')
    ],
    
    update: [
      check('name').optional().trim().not().isEmpty().withMessage('Goal name cannot be empty'),
      check('target').optional().isNumeric().withMessage('Target amount must be a number')
    ],
    
    addMoney: [
      check('amount').isNumeric().withMessage('Amount must be a number').custom(value => value > 0).withMessage('Amount must be greater than 0')
    ]
  },
  
  // Settings validations
  settings: {
    update: [
      check('theme').optional().isIn(['light', 'dark']).withMessage('Theme must be light or dark'),
      check('color_theme').optional().isIn(['purple', 'blue']).withMessage('Color theme must be purple or blue'),
      check('font_size').optional().isIn(['small', 'medium', 'large']).withMessage('Font size must be small, medium, or large'),
      check('language').optional().isIn(['ENG', 'TR']).withMessage('Language must be ENG or TR')
    ],
    
    updateProfile: [
      check('name').optional().trim().not().isEmpty().withMessage('Name cannot be empty'),
      check('email').optional().isEmail().withMessage('Please provide a valid email address')
    ]
  }
};