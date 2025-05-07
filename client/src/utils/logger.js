export const logApiCall = (endpoint, method, success, data = null, error = null) => {
    console.log(`API ${method} to ${endpoint}: ${success ? 'SUCCESS' : 'FAILURE'}`);
    
    if (data) {
      console.log('Response data:', data);
    }
    
    if (error) {
      console.error('Error:', error);
    }
  };