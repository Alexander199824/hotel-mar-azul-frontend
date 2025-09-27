/**
 * Servicio de Habitaciones - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/services/roomService.js
 */

import { apiMethods, handleApiError } from './api';

export const roomService = {
  // Obtener todas las habitaciones
  getAll: async (params = {}) => {
    try {
      const response = await apiMethods.get('/rooms', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Buscar habitaciones disponibles
  searchAvailable: async (searchData) => {
    try {
      const response = await apiMethods.get('/rooms/search', { params: searchData });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener habitación por ID
  getById: async (roomId) => {
    try {
      const response = await apiMethods.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener estadísticas de habitaciones
  getStats: async () => {
    try {
      const response = await apiMethods.get('/rooms/stats');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cambiar estado de habitación
  changeStatus: async (roomId, statusData) => {
    try {
      const response = await apiMethods.patch(`/rooms/${roomId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Crear nueva habitación
  create: async (roomData) => {
    try {
      const response = await apiMethods.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Actualizar habitación
  update: async (roomId, roomData) => {
    try {
      const response = await apiMethods.put(`/rooms/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Marcar como fuera de servicio
  setOutOfOrder: async (roomId, reason) => {
    try {
      const response = await apiMethods.post(`/rooms/${roomId}/out-of-order`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Poner en servicio
  setInService: async (roomId) => {
    try {
      const response = await apiMethods.post(`/rooms/${roomId}/in-service`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};