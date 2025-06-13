import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // API backendu
  headers: {
    'Content-Type': 'application/json',
  },
});

// DEBUG: Interceptor do przechwytywania zapytań
api.interceptors.request.use(
  (config) => {
    console.log('🚀 AXIOS REQUEST:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: (config.baseURL || '') + (config.url || ''),
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('❌ AXIOS REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ AXIOS RESPONSE:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error('❌ AXIOS RESPONSE ERROR:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default api;