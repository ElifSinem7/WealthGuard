const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate a JWT token for authentication
 * @param {Object} user User object containing id and other properties
 * @returns {String} JWT token
 */
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

/**
 * Verify a JWT token
 * @param {String} token JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Check if a token is valid without throwing an error
 * @param {String} token JWT token to check
 * @returns {Boolean} True if token is valid, false otherwise
 */
exports.isTokenValid = (token) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};