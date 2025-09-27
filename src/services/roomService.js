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

/**
 * Servicio de Reservas - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/services/reservationService.js
 */

export const reservationService = {
  // Obtener todas las reservas
  getAll: async (params = {}) => {
    try {
      const response = await apiMethods.get('/reservations', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Crear nueva reserva
  create: async (reservationData) => {
    try {
      const response = await apiMethods.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener reserva por ID
  getById: async (reservationId) => {
    try {
      const response = await apiMethods.get(`/reservations/${reservationId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Actualizar reserva
  update: async (reservationId, reservationData) => {
    try {
      const response = await apiMethods.put(`/reservations/${reservationId}`, reservationData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Confirmar reserva
  confirm: async (reservationId) => {
    try {
      const response = await apiMethods.post(`/reservations/${reservationId}/confirm`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cancelar reserva
  cancel: async (reservationId, reason) => {
    try {
      const response = await apiMethods.post(`/reservations/${reservationId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Check-in
  checkIn: async (reservationId, notes = '') => {
    try {
      const response = await apiMethods.post(`/reservations/${reservationId}/checkin`, { notes });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Check-out
  checkOut: async (reservationId, notes = '', generateInvoice = true) => {
    try {
      const response = await apiMethods.post(`/reservations/${reservationId}/checkout`, {
        notes,
        generate_invoice: generateInvoice,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Buscar reservas
  search: async (query) => {
    try {
      const response = await apiMethods.get('/reservations/search', { params: { query } });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener estadísticas
  getStats: async (startDate, endDate) => {
    try {
      const response = await apiMethods.get('/reservations/stats', {
        params: { start_date: startDate, end_date: endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};