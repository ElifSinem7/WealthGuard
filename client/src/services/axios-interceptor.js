import axios from 'axios';
import AuthService from './auth.service';

// Axios request interceptor
axios.interceptors.request.use(
  config => {
    // Add authorization header to every request if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Axios response interceptor
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle 401 responses (unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear user data
      AuthService.logout();
      
      // Redirect to login page
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axios;