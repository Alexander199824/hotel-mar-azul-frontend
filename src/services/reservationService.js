/**
 * Servicio de Reservas - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/services/reservationService.js
 */

import { apiMethods, handleApiError } from './api';
import { cleanObject } from '../utils/helpers';

export const reservationService = {
  // Obtener todas las reservas
  getAll: async (params = {}) => {
    try {
      // Filtrar parámetros vacíos antes de enviar
      const cleanParams = cleanObject(params);
      const response = await apiMethods.get('/reservations', { params: cleanParams });
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
      // Filtrar parámetros vacíos antes de enviar
      const cleanParams = cleanObject({ start_date: startDate, end_date: endDate });
      const response = await apiMethods.get('/reservations/stats', {
        params: cleanParams,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};