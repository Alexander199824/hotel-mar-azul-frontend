/**
 * Servicio API Principal Corregido - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/services/api.js
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

console.log('🌐 API Base URL configurada:', API_BASE_URL);

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
    
    // Log para debugging
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // Log detallado del error
    const errorDetails = {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message
    };

    console.error('❌ Error en response interceptor:', errorDetails);

    // Log adicional para errores 400 (Bad Request)
    if (error.response?.status === 400) {
      console.error('🔍 Detalles del error 400:', {
        mensaje: error.response?.data?.message || error.response?.data?.error,
        errores: error.response?.data?.errors,
        payload_enviado: error.config?.data
      });
    }

    if (error.response?.status === 401) {
      console.log('🔐 Token expirado, limpiando localStorage...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      // Solo redirigir si no estamos ya en login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
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

// Manejador de errores estándar mejorado
export const handleApiError = (error) => {
  // Log del error para debugging
  if (process.env.REACT_APP_DEBUG_MODE === 'true') {
    console.error('🐛 API Error Details:', error);
  }

  if (error.response) {
    // Error del servidor con respuesta
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;
    const errors = error.response.data?.errors;

    switch (status) {
      case 400:
        // Si hay errores de validación específicos, mostrarlos
        if (errors && Array.isArray(errors)) {
          return `Datos inválidos:\n${errors.map(e => `- ${e.message || e}`).join('\n')}`;
        }
        if (errors && typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, msg]) => `- ${field}: ${msg}`)
            .join('\n');
          return `Datos inválidos:\n${errorMessages}`;
        }
        return message || 'Datos inválidos. Verifique la información.';
      case 401:
        return 'Credenciales incorrectas o sesión expirada.';
      case 403:
        return 'No tiene permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 429:
        return 'Demasiadas solicitudes. Intente más tarde.';
      case 500:
        return 'Error interno del servidor. Intente nuevamente.';
      default:
        return message || `Error del servidor (${status})`;
    }
  } else if (error.request) {
    // Error de red
    return 'Sin conexión al servidor. Verifique su internet y que el servidor esté ejecutándose.';
  } else {
    // Error de configuración
    return error.message || 'Error inesperado';
  }
};

// Función para verificar conectividad con el servidor
export const checkServerHealth = async () => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

export default api;