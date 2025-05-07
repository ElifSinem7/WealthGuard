import axios from 'axios';
import API_CONFIG from './api.config';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}`;

class AuthService {
  // Register user
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  }

  // Login user
  async login(email, password) {
    try {
      console.log("Sending login request to:", API_URL);
      const response = await axios.post(`${API_URL}/login`, { email, password });
      console.log("Login response:", response);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Login error in service:", error);
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
  }

  // Get user profile
  async fetchUserDetails() {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: this.authHeader()
      });
      return response.data.data.user;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user details' };
    }
  }

  // Check if user is logged in
  isSessionValid() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Reset password
  async resetPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to request password reset' };
    }
  }

  // Auth header for API requests
  authHeader() {
    const token = localStorage.getItem('token');
    
    if (token) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return {};
    }
  }
}

export default new AuthService();