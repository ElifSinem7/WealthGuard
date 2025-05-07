const jwt = require('jsonwebtoken');
const { promisify } = require('util');
require('dotenv').config();

/**
 * Authentication middleware - Protects routes from unauthorized access
 */
module.exports = async (req, res, next) => {
  try {
    // 1) Get token from authorization header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2) Check if token exists
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to access this resource'
      });
    }

    // 3) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 4) Check if user still exists
    const db = require('../config/database');
    const [user] = await db.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [decoded.id]
    );

    if (user.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists'
      });
    }

    // 5) Add user to request object
    req.user = user[0];
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token. Please log in again'
    });
  }
};