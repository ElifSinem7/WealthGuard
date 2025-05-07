const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define log file paths
const accessLogPath = path.join(logsDir, 'access.log');
const errorLogPath = path.join(logsDir, 'error.log');
const debugLogPath = path.join(logsDir, 'debug.log');

/**
 * Log levels
 */
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Color codes for console output
 */
const COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  GREEN: '\x1b[32m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  GRAY: '\x1b[90m'
};

/**
 * Format current timestamp
 * @returns {String} Formatted timestamp
 */
const timestamp = () => {
  return new Date().toISOString();
};

/**
 * Write log message to file
 * @param {String} filePath - Log file path
 * @param {String} message - Log message
 */
const writeToFile = (filePath, message) => {
  const logMessage = `${timestamp()} ${message}\n`;
  fs.appendFile(filePath, logMessage, (err) => {
    if (err) {
      console.error(`Failed to write to log file: ${err.message}`);
    }
  });
};

/**
 * Format log message
 * @param {String} level - Log level
 * @param {String} message - Log message
 * @param {Object} meta - Additional metadata
 * @returns {String} Formatted log message
 */
const formatLogMessage = (level, message, meta = {}) => {
  let metaString = '';
  
  if (Object.keys(meta).length > 0) {
    metaString = JSON.stringify(meta);
  }
  
  return `[${level}] ${message} ${metaString}`.trim();
};

/**
 * Log message with colored console output and file logging
 * @param {String} level - Log level
 * @param {String} message - Log message
 * @param {Object} meta - Additional metadata
 */
const log = (level, message, meta = {}) => {
  // Skip debug logs in production
  if (level === LOG_LEVELS.DEBUG && config.server.env === 'production') {
    return;
  }
  
  const formattedMessage = formatLogMessage(level, message, meta);
  
  // Console output with colors
  switch (level) {
    case LOG_LEVELS.ERROR:
      console.error(`${COLORS.RED}${formattedMessage}${COLORS.RESET}`);
      writeToFile(errorLogPath, formattedMessage);
      break;
    case LOG_LEVELS.WARN:
      console.warn(`${COLORS.YELLOW}${formattedMessage}${COLORS.RESET}`);
      writeToFile(errorLogPath, formattedMessage);
      break;
    case LOG_LEVELS.INFO:
      console.info(`${COLORS.GREEN}${formattedMessage}${COLORS.RESET}`);
      writeToFile(accessLogPath, formattedMessage);
      break;
    case LOG_LEVELS.DEBUG:
      console.debug(`${COLORS.CYAN}${formattedMessage}${COLORS.RESET}`);
      writeToFile(debugLogPath, formattedMessage);
      break;
    default:
      console.log(`${formattedMessage}`);
      writeToFile(accessLogPath, formattedMessage);
  }
};

/**
 * Logger API
 */
const logger = {
  /**
   * Log error message
   * @param {String} message - Error message
   * @param {Object} meta - Additional metadata
   */
  error: (message, meta = {}) => {
    log(LOG_LEVELS.ERROR, message, meta);
  },
  
  /**
   * Log warning message
   * @param {String} message - Warning message
   * @param {Object} meta - Additional metadata
   */
  warn: (message, meta = {}) => {
    log(LOG_LEVELS.WARN, message, meta);
  },
  
  /**
   * Log info message
   * @param {String} message - Info message
   * @param {Object} meta - Additional metadata
   */
  info: (message, meta = {}) => {
    log(LOG_LEVELS.INFO, message, meta);
  },
  
  /**
   * Log debug message
   * @param {String} message - Debug message
   * @param {Object} meta - Additional metadata
   */
  debug: (message, meta = {}) => {
    log(LOG_LEVELS.DEBUG, message, meta);
  },
  
  /**
   * Log HTTP request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  request: (req, res) => {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '-';
    const message = `${method} ${originalUrl} ${res.statusCode}`;
    const meta = { ip, userAgent };
    
    log(LOG_LEVELS.INFO, message, meta);
  },
  
  /**
   * Create a custom logger with predefined metadata
   * @param {String} module - Module name
   * @returns {Object} Custom logger instance
   */
  createLogger: (module) => {
    return {
      error: (message, meta = {}) => logger.error(message, { module, ...meta }),
      warn: (message, meta = {}) => logger.warn(message, { module, ...meta }),
      info: (message, meta = {}) => logger.info(message, { module, ...meta }),
      debug: (message, meta = {}) => logger.debug(message, { module, ...meta })
    };
  }
};

module.exports = logger;