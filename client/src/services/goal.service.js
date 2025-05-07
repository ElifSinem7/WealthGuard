import axios from 'axios';
import AuthService from './auth.service';
import API_CONFIG from './api.config';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GOALS}`; // Change to correct endpoint

class GoalService {
  // Get all goals
  async getAllGoals() {
    try {
      const response = await axios.get(API_URL, {
        headers: AuthService.authHeader()
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Get all goals error:', error);
      throw error.response?.data || { message: 'Failed to fetch goals' };
    }
  }

  // Get goal by ID
  async getGoal(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: AuthService.authHeader()
      });
      
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch goal' };
    }
  }

  // Add new goal
  async addGoal(goal) {
    try {
      const response = await axios.post(API_URL, goal, {
        headers: AuthService.authHeader()
      });
      
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add goal' };
    }
  }

  // Update goal
  async updateGoal(id, goal) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, goal, {
        headers: AuthService.authHeader()
      });
      
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update goal' };
    }
  }

  // Add money to goal
  async addMoneyToGoal(id, amount) {
    try {
      const response = await axios.patch(`${API_URL}/${id}/add-money`, { amount }, {
        headers: AuthService.authHeader()
      });
      
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add money to goal' };
    }
  }

  // Delete goal
  async deleteGoal(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: AuthService.authHeader()
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete goal' };
    }
  }
}

export default new GoalService();