/**
 * Funciones de Utilidad - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/utils/helpers.js
 */

import { useState, useCallback } from 'react';
import { DATE_FORMATS } from './constants';

// Formateo de fechas
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  switch (format) {
    case DATE_FORMATS.DISPLAY:
      return d.toLocaleDateString('es-GT');
    case DATE_FORMATS.API:
      return d.toISOString().split('T')[0];
    case DATE_FORMATS.DATETIME_DISPLAY:
      return d.toLocaleString('es-GT');
    case DATE_FORMATS.DATETIME_API:
      return d.toISOString();
    default:
      return d.toLocaleDateString('es-GT');
  }
};

// Formateo de moneda
export const formatCurrency = (amount, currency = 'GTQ') => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Q0.00';
  
  const numAmount = parseFloat(amount);
  
  if (currency === 'GTQ') {
    return `Q${numAmount.toLocaleString('es-GT', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }
  
  try {
    const formatter = new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(numAmount);
  } catch (error) {
    return `${currency} ${numAmount.toFixed(2)}`;
  }
};

// Manejo de errores de API
export const handleApiError = (error) => {
  // Log del error para debugging
  if (process.env.REACT_APP_DEBUG_MODE === 'true') {
    // Comentado para evitar warnings de ESLint en producción
    // console.error('API Error:', error);
  }

  if (error.response) {
    // Error del servidor con respuesta
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;
    
    switch (status) {
      case 400:
        return message || 'Datos inválidos. Verifique la información.';
      case 401:
        return 'Sesión expirada. Inicie sesión nuevamente.';
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
    return 'Sin conexión al servidor. Verifique su internet.';
  } else {
    // Error de configuración
    return error.message || 'Error inesperado';
  }
};

// Validación de token almacenado
export const validateStoredAuth = () => {
  // Verificar si estamos en un entorno de navegador
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null;
  }

  try {
    const token = window.localStorage.getItem('authToken');
    const userData = window.localStorage.getItem('user');

    if (!token || !userData) {
      return null;
    }

    // Verificar si el token no está expirado (básico)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('user');
      return null;
    }

    const user = JSON.parse(userData);
    if (!user.id || !user.role) {
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('user');
      return null;
    }

    return { user, token };
  } catch (error) {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('user');
    }
    return null;
  }
};

// Validación de rango de fechas
export const validateDateRange = (startDate, endDate, allowSameDay = false) => {
  if (!startDate || !endDate) {
    return 'Ambas fechas son requeridas';
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Formato de fecha inválido';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return 'La fecha de inicio no puede ser anterior a hoy';
  }

  if (allowSameDay) {
    if (end < start) {
      return 'La fecha de fin debe ser igual o posterior a la fecha de inicio';
    }
  } else {
    if (end <= start) {
      return 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
  }

  // Verificar que no sea más de 1 año en el futuro
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  
  if (start > maxDate || end > maxDate) {
    return 'Las fechas no pueden ser más de un año en el futuro';
  }

  return null;
};

// Hook personalizado para manejo de errores
export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error) => {
    const message = handleApiError(error);
    setError(message);
    
    // Auto-clear error después de 10 segundos
    setTimeout(() => setError(null), 10000);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

// Utilidad para sanitizar inputs
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres básicos de XSS
    .substring(0, 1000); // Limitar longitud
};

// Manejo seguro de localStorage
export const safeLocalStorage = {
  setItem: (key, value) => {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return false;
    }
    try {
      window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      return true;
    } catch (error) {
      // console.warn('Error saving to localStorage:', error);
      return false;
    }
  },

  getItem: (key, defaultValue = null) => {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return defaultValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      // console.warn('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  removeItem: (key) => {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return false;
    }
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      // console.warn('Error removing from localStorage:', error);
      return false;
    }
  }
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar teléfono
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone);
};

// Generar color por estado
export const getStatusColor = (status, type = 'room') => {
  const colors = {
    room: {
      available: 'green',
      occupied: 'red',
      cleaning: 'yellow',
      maintenance: 'orange',
      out_of_order: 'gray'
    },
    reservation: {
      pending: 'yellow',
      confirmed: 'blue',
      checked_in: 'green',
      checked_out: 'gray',
      cancelled: 'red'
    },
    incident: {
      reported: 'yellow',
      in_progress: 'blue',
      resolved: 'green',
      cancelled: 'gray'
    }
  };

  return colors[type]?.[status] || 'gray';
};

// Calcular días entre fechas
export const daysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalizar primera letra
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Limpiar objeto de valores vacíos
export const cleanObject = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// Generar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validar rango de fechas
export const isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

// Obtener edad desde fecha de nacimiento
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Formatear porcentaje
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};

// Objeto con todas las funciones como exportación por defecto
const helpers = {
  formatDate,
  formatCurrency,
  isValidEmail,
  isValidPhone,
  getStatusColor,
  daysBetween,
  truncateText,
  capitalize,
  debounce,
  cleanObject,
  generateId,
  isValidDateRange,
  calculateAge,
  formatPercentage,
  handleApiError,
  validateStoredAuth,
  validateDateRange,
  sanitizeInput,
  safeLocalStorage,
  useErrorHandler
};

export default helpers;