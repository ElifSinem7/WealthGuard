import axios from 'axios';
import AuthService from './auth.service';
import API_CONFIG from './api.config';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SETTINGS}`;
class SettingService {
  // Get user settings
  async getSettings() {
    try {
      const response = await axios.get(API_URL, {
        headers: AuthService.authHeader()
      });
      
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch settings' };
    }
  }

  // Update user settings
  async updateSettings(settings) {
    try {
      const response = await axios.put(API_URL, settings, {
        headers: AuthService.authHeader()
      });
      
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update settings' };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await axios.put(`${API_URL}/profile`, profileData, {
        headers: AuthService.authHeader()
      });
      
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, { email }, {
        headers: AuthService.authHeader()
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  }
}

export default new SettingService();