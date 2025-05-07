const bcrypt = require('bcrypt');
const db = require('../config/database');
const tokenUtils = require('../utils/tokenUtils');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists
    const [existingUser] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Set up default categories for new user
    const userId = result.insertId;
    const defaultCategories = [
      { name: 'Salary', type: 'income' },
      { name: 'Freelance', type: 'income' },
      { name: 'Gift', type: 'income' },
      { name: 'Investment', type: 'income' },
      { name: 'Food', type: 'expense' },
      { name: 'Transport', type: 'expense' },
      { name: 'Shopping', type: 'expense' },
      { name: 'Entertainment', type: 'expense' },
      { name: 'Utilities', type: 'expense' },
      { name: 'Health', type: 'expense' },
      { name: 'Education', type: 'expense' },
      { name: 'Other', type: 'expense' }
    ];

    // Insert default categories
    for (const category of defaultCategories) {
      await db.execute(
        'INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)',
        [category.name, category.type, userId]
      );
    }

    // Create user settings entry
    await db.execute(
      'INSERT INTO user_settings (user_id, theme, color_theme, font_size, language) VALUES (?, ?, ?, ?, ?)',
      [userId, 'light', 'purple', 'medium', 'ENG']
    );

    // Generate token
    const token = tokenUtils.generateToken({ id: userId, email });

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: userId,
          name,
          email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login existing user
 * @route POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = tokenUtils.generateToken({ id: user.id, email: user.email });

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    // User is already attached to req by auth middleware
    const userId = req.user.id;

    // Get user details and nickname from settings
    const [users] = await db.execute(
      `SELECT u.id, u.name, u.email, us.theme, us.color_theme, us.font_size, us.language
      FROM users u
      LEFT JOIN user_settings us ON u.id = us.user_id
      WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const user = users[0];

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          nickname: user.name.split(' ')[0] || user.name, // Default nickname to first name
          theme: user.theme || 'light',
          colorTheme: user.color_theme || 'purple',
          fontSize: user.font_size || 'medium',
          language: user.language || 'ENG'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Validate JWT token
 * @route POST /api/auth/validate-token
 */
exports.validateToken = async (req, res, next) => {
  try {
    // Auth middleware already verified the token
    // If we made it here, token is valid
    res.status(200).json({
      status: 'success',
      message: 'Token is valid',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle password reset request
 * @route POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide an email address'
      });
    }

    // Check if user exists
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // Don't reveal that user doesn't exist for security reasons
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // similate e-mail reset link 
    res.status(200).json({
      status: 'success',
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    next(error);
  }
};