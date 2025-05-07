require('dotenv').config();

module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
  },
  
  // Database configuration
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '30d',
  },
  
  // Email configuration
  email: {
    service: process.env.EMAIL_SERVICE,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },
  
  // API configuration
  api: {
    basePath: '/api',
    version: 'v1',
  },

  // Other application-wide settings
  app: {
    defaultCurrency: 'USD',
    sessionTimeout: 60 * 60 * 1000, // 1 hour in milliseconds
    paginationLimit: 50,
  }
};