const db = require('../config/database');

/**
 * Get user settings
 * @route GET /api/settings
 */
exports.getSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user settings
    const [settings] = await db.execute(
      `SELECT theme, color_theme, font_size, language
       FROM user_settings
       WHERE user_id = ?`,
      [userId]
    );
    
    // If settings don't exist, create default settings
    if (settings.length === 0) {
      const defaultSettings = {
        theme: 'light',
        color_theme: 'purple',
        font_size: 'medium',
        language: 'ENG'
      };
      
      await db.execute(
        `INSERT INTO user_settings (user_id, theme, color_theme, font_size, language)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, defaultSettings.theme, defaultSettings.color_theme, defaultSettings.font_size, defaultSettings.language]
      );
      
      return res.status(200).json({
        status: 'success',
        data: defaultSettings
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: settings[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user settings
 * @route PUT /api/settings
 */
exports.updateSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { theme, color_theme, font_size, language } = req.body;
    
    // Check if settings exist
    const [existingSettings] = await db.execute(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    // If settings don't exist, create them
    if (existingSettings.length === 0) {
      const values = [
        userId,
        theme || 'light',
        color_theme || 'purple',
        font_size || 'medium',
        language || 'ENG'
      ];
      
      await db.execute(
        `INSERT INTO user_settings (user_id, theme, color_theme, font_size, language)
         VALUES (?, ?, ?, ?, ?)`,
        values
      );
      
      const newSettings = {
        theme: theme || 'light',
        color_theme: color_theme || 'purple',
        font_size: font_size || 'medium',
        language: language || 'ENG'
      };
      
      return res.status(201).json({
        status: 'success',
        data: newSettings
      });
    }
    
    // Update fields
    let updateFields = [];
    let updateParams = [];
    
    if (theme) {
      updateFields.push('theme = ?');
      updateParams.push(theme);
    }
    
    if (color_theme) {
      updateFields.push('color_theme = ?');
      updateParams.push(color_theme);
    }
    
    if (font_size) {
      updateFields.push('font_size = ?');
      updateParams.push(font_size);
    }
    
    if (language) {
      updateFields.push('language = ?');
      updateParams.push(language);
    }
    
    // Exit if no fields to update
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      });
    }
    
    // Build and execute the update query
    updateParams.push(userId);
    await db.execute(
      `UPDATE user_settings SET ${updateFields.join(', ')} WHERE user_id = ?`,
      updateParams
    );
    
    // Get updated settings
    const [updatedSettings] = await db.execute(
      `SELECT theme, color_theme, font_size, language
       FROM user_settings
       WHERE user_id = ?`,
      [userId]
    );
    
    if (updatedSettings.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Settings not found after update'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: updatedSettings[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @route PUT /api/settings/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, nickname, email } = req.body;
    
    // Check if user exists
    const [users] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Update fields
    let updateFields = [];
    let updateParams = [];
    
    if (name) {
      updateFields.push('name = ?');
      updateParams.push(name);
    }
    
    if (email) {
      // Check if email is already used by another user
      const [existingUsers] = await db.execute(
        'SELECT * FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      
      if (existingUsers.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use'
        });
      }
      
      updateFields.push('email = ?');
      updateParams.push(email);
    }
    
    // Exit if no fields to update
    if (updateFields.length === 0 && !nickname) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      });
    }
    
    // Update user in transaction if needed
    if (updateFields.length > 0) {
      updateParams.push(userId);
      await db.execute(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateParams
      );
    }
    
    // Get updated user
    const [updatedUser] = await db.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [userId]
    );
    
    if (updatedUser.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found after update'
      });
    }
    
    // Return updated user details
    const user = updatedUser[0];
    
    // Include nickname from settings if available
    const [settings] = await db.execute(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        nickname: nickname || (settings.length > 0 ? settings[0].nickname : null)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset user password
 * @route POST /api/settings/reset-password
 */
exports.resetPassword = async (req, res, next) => {
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
    
    //  simulate success
    res.status(200).json({
      status: 'success',
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    next(error);
  }
};