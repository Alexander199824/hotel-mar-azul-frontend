/**
 * Servicio de Autenticación - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/services/authService.js
 */

import { apiMethods, handleApiError } from './api';

export const authService = {
  // Login de usuario
  login: async (credentials) => {
    try {
      const response = await apiMethods.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await apiMethods.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiMethods.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  // Obtener perfil actual
  getProfile: async () => {
    try {
      const response = await apiMethods.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    try {
      const response = await apiMethods.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    try {
      const response = await apiMethods.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Solicitar recuperación de contraseña
  requestPasswordReset: async (email) => {
    try {
      const response = await apiMethods.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Validar token
  validateToken: async () => {
    try {
      const response = await apiMethods.get('/auth/validate-token');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener configuración pública
  getPublicConfig: async () => {
    try {
      const response = await apiMethods.get('/auth/config');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};