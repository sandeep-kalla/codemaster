// Simple utility to test API connection
import axios from 'axios';

const API_URL = 'https://codemaster-api.vercel.app';

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection to:', API_URL);
    
    // Test root endpoint
    const rootResponse = await axios.get(API_URL);
    console.log('Root endpoint response:', rootResponse.data);
    
    // Test health endpoint
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('Health endpoint response:', healthResponse.data);
    
    // Test API endpoint
    const apiResponse = await axios.get(`${API_URL}/api/leetcode/questions?page=1&page_size=10`);
    console.log('API endpoint response:', apiResponse.data);
    
    return {
      success: true,
      message: 'API connection successful',
      data: {
        root: rootResponse.data,
        health: healthResponse.data,
        api: apiResponse.data
      }
    };
  } catch (error) {
    console.error('API connection test failed:', error);
    
    return {
      success: false,
      message: 'API connection failed',
      error: {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null
      }
    };
  }
};

// Export a function to test a specific endpoint
export const testEndpoint = async (endpoint) => {
  try {
    console.log(`Testing endpoint: ${API_URL}${endpoint}`);
    const response = await axios.get(`${API_URL}${endpoint}`);
    console.log('Endpoint response:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Error testing endpoint ${endpoint}:`, error);
    return {
      success: false,
      error: {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null
      }
    };
  }
};
