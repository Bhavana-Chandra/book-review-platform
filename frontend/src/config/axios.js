import axios from 'axios';

// Set default base URL for all axios requests
axios.defaults.baseURL = 'https://book-review-platform-1-nks5.onrender.com'; 

// Add request interceptor to include credentials
axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axios;
