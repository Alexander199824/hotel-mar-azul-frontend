/**
 * Servicio API Principal - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/services/api.js
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Métodos genéricos de API
export const apiMethods = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

// Manejador de errores estándar
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || 'Error del servidor';
  } else if (error.request) {
    return 'No se pudo conectar con el servidor';
  } else {
    return 'Error inesperado';
  }
};

export default api;
// comentarios 