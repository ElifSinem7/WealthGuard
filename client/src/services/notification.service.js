import axios from 'axios';
import AuthService from './auth.service';
import API_CONFIG from './api.config';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}`;
class NotificationService {
  // Get all notifications
  async getAllNotifications() {
    try {
      const response = await axios.get(API_URL, {
        headers: AuthService.authHeader()
      });
      
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notifications' };
    }
  }

  // Mark notification as read
  async markAsRead(id) {
    try {
      const response = await axios.patch(`${API_URL}/${id}/read`, {}, {
        headers: AuthService.authHeader()
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark notification as read' };
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await axios.patch(`${API_URL}/read-all`, {}, {
        headers: AuthService.authHeader()
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark all notifications as read' };
    }
  }

  // Delete notification
  async deleteNotification(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: AuthService.authHeader()
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete notification' };
    }
  }
}

export default new NotificationService();