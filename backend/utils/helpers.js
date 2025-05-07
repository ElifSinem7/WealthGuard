/**
 * Format a date to YYYY-MM-DD
 * @param {Date} date - Date to format
 * @returns {String} Formatted date string
 */
exports.formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };
  
  /**
   * Format currency amount
   * @param {Number} amount - Amount to format
   * @param {String} currency - Currency code (default: USD)
   * @returns {String} Formatted amount with currency symbol
   */
  exports.formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    });
    
    return formatter.format(amount);
  };
  
  /**
   * Calculate percentage
   * @param {Number} part - The part value
   * @param {Number} whole - The whole value
   * @returns {Number} Percentage value
   */
  exports.calculatePercentage = (part, whole) => {
    if (!whole || whole === 0) return 0;
    return Math.round((part / whole) * 100);
  };
  
  /**
   * Get the first day of the current month
   * @returns {Date} First day of current month
   */
  exports.getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };
  
  /**
   * Get the last day of the current month
   * @returns {Date} Last day of current month
   */
  exports.getLastDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  };
  
  /**
   * Get the first day of the current year
   * @returns {Date} First day of current year
   */
  exports.getFirstDayOfYear = () => {
    const now = new Date();
    return new Date(now.getFullYear(), 0, 1);
  };
  
  /**
   * Get date range for a period
   * @param {String} period - Period type (day, week, month, year)
   * @returns {Object} Start and end dates for the period
   */
  exports.getDateRangeForPeriod = (period) => {
    const now = new Date();
    let startDate, endDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'week':
        // Get first day of week (Sunday)
        const firstDay = now.getDate() - now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), firstDay);
        endDate = new Date(now.getFullYear(), now.getMonth(), firstDay + 6, 23, 59, 59);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
      default:
        // Default to current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }
    
    return {
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate)
    };
  };
  
  /**
   * Generate a random alphanumeric string
   * @param {Number} length - Length of the string
   * @returns {String} Random string
   */
  exports.generateRandomString = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  };
  
  /**
   * Remove sensitive data from user object
   * @param {Object} user - User object
   * @returns {Object} User object without sensitive data
   */
  exports.sanitizeUser = (user) => {
    if (!user) return null;
    
    const { password, reset_token, ...sanitizedUser } = user;
    return sanitizedUser;
  };
  
  /**
   * Check if a date is in the future
   * @param {Date|String} date - Date to check
   * @returns {Boolean} True if date is in the future
   */
  exports.isFutureDate = (date) => {
    const checkDate = new Date(date);
    const now = new Date();
    
    return checkDate > now;
  };
  
  /**
   * Calculate the days remaining until a date
   * @param {Date|String} date - Target date
   * @returns {Number} Number of days remaining
   */
  exports.daysUntil = (date) => {
    const targetDate = new Date(date);
    const now = new Date();
    
    // Set both dates to start of day
    targetDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(targetDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };