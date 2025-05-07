/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    // Database error handling
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'error',
        message: 'This record already exists'
      });
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again'
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Your token has expired. Please log in again'
      });
    }
  
    // Default error response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong on the server';
  
    res.status(statusCode).json({
      status: 'error',
      message: message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
  };
  
  module.exports = errorHandler;