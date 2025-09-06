import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token (implement this if you have refresh token functionality)
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post('/api/auth/refresh', { refreshToken });
        // const { token } = response.data;
        // localStorage.setItem('token', token);
        // originalRequest.headers.Authorization = `Bearer ${token}`;
        // return apiClient(originalRequest);

        // For now, just redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;