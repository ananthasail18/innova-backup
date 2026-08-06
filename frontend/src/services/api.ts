import axios, { type AxiosError, type AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

/**
 * Dynamically resolves the API base URL depending on environment:
 * - Environment variable VITE_API_BASE_URL
 * - Android Emulator host (10.0.2.2)
 * - Localhost / Network IP host (port 8001)
 */
const resolveApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8001/api/v1';
    }
    if (hostname === '10.0.2.2') {
      return 'http://10.0.2.2:8001/api/v1';
    }
    // In production (Vercel), we rely on relative paths since the frontend and backend 
    // are served on the same domain via vercel.json rewrites.
    return '/api/v1';
  }

  return 'http://localhost:8001/api/v1';
};

const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
