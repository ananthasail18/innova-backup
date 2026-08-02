import axios, { type AxiosError, type AxiosResponse } from 'axios';

// Define a standard API response envelope
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Centralized error handling
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
