/**
 * Servicio de Huéspedes - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/services/guestService.js
 */

import { apiMethods, handleApiError } from './api';

export const guestService = {
  // Obtener todos los huéspedes
  getAll: async (params = {}) => {
    try {
      const response = await apiMethods.get('/guests', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Buscar huésped por email
  searchByEmail: async (email) => {
    try {
      const response = await apiMethods.get('/guests', {
        params: { email: email.trim().toLowerCase() }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Crear nuevo huésped
  create: async (guestData) => {
    try {
      const response = await apiMethods.post('/guests', guestData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener huésped por ID
  getById: async (guestId) => {
    try {
      const response = await apiMethods.get(`/guests/${guestId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Actualizar huésped
  update: async (guestId, guestData) => {
    try {
      const response = await apiMethods.put(`/guests/${guestId}`, guestData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Buscar huéspedes
  search: async (query) => {
    try {
      const response = await apiMethods.get('/guests/search', { params: { query } });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener o crear el perfil del usuario autenticado
  getOrCreateMyProfile: async () => {
    try {
      const response = await apiMethods.get('/guests/me');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
