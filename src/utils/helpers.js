/**
 * Funciones de Utilidad - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/utils/helpers.js
 */

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
  if (amount === null || amount === undefined) return '';
  
  const formatter = new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: currency === 'GTQ' ? 'USD' : currency,
  });
  
  return currency === 'GTQ' ? `Q${amount.toFixed(2)}` : formatter.format(amount);
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar teléfono
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
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

export default {
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
  formatPercentage
};