const db = require('../config/database');

/**
 * Get all notifications for the authenticated user
 * @route GET /api/notifications
 */
exports.getAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const [notifications] = await db.execute(
      `SELECT id, title, body, read, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    
    // Format notifications
    const formattedNotifications = notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.body,
      date: formatTimeAgo(new Date(notification.created_at)),
      read: !!notification.read
    }));
    
    res.status(200).json({
      status: 'success',
      count: formattedNotifications.length,
      data: formattedNotifications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a notification as read
 * @route PATCH /api/notifications/:id/read
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    // Check if notification exists and belongs to user
    const [notifications] = await db.execute(
      'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );
    
    if (notifications.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }
    
    // Update notification status
    await db.execute(
      'UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 * @route PATCH /api/notifications/read-all
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Update all notifications
    await db.execute(
      'UPDATE notifications SET read = 1 WHERE user_id = ?',
      [userId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a notification
 * @route DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    // Check if notification exists and belongs to user
    const [notifications] = await db.execute(
      'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );
    
    if (notifications.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }
    
    // Delete the notification
    await db.execute(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to format time ago
 * @param {Date} date - The date to format
 * @returns {String} - Formatted time ago string
 */
function formatTimeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) {
    return 'just now';
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }
  
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}