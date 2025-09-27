/**
 * Servicio de Reportes - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/services/reportService.js
 */

import { apiMethods, handleApiError } from './api';

export const reportService = {
  // Obtener dashboard principal
  getDashboard: async (period = 30) => {
    try {
      const response = await apiMethods.get('/reports/dashboard', { 
        params: { period } 
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Generar reporte de ocupación
  generateOccupancyReport: async (startDate, endDate, filters = {}) => {
    try {
      const response = await apiMethods.get('/reports/occupancy', {
        params: {
          start_date: startDate,
          end_date: endDate,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Generar reporte de ventas
  generateSalesReport: async (startDate, endDate, filters = {}) => {
    try {
      const response = await apiMethods.get('/reports/sales', {
        params: {
          start_date: startDate,
          end_date: endDate,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Generar reporte de huéspedes
  generateGuestsReport: async (startDate, endDate, filters = {}) => {
    try {
      const response = await apiMethods.get('/reports/guests', {
        params: {
          start_date: startDate,
          end_date: endDate,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Generar reporte financiero
  generateFinancialReport: async (startDate, endDate, filters = {}) => {
    try {
      const response = await apiMethods.get('/reports/financial', {
        params: {
          start_date: startDate,
          end_date: endDate,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Generar reporte de incidencias
  generateIncidentsReport: async (startDate, endDate, filters = {}) => {
    try {
      const response = await apiMethods.get('/reports/incidents', {
        params: {
          start_date: startDate,
          end_date: endDate,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Generar reporte personalizado
  generateCustomReport: async (reportData) => {
    try {
      const response = await apiMethods.post('/reports/custom', reportData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener reportes disponibles
  getAvailableReports: async () => {
    try {
      const response = await apiMethods.get('/reports');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Exportar reporte
  exportReport: async (reportData, format) => {
    try {
      const filename = `reporte_${new Date().toISOString().split('T')[0]}.${format}`;
      
      // Simular exportación por ahora
      return {
        contentType: format === 'pdf' ? 'application/pdf' : 
                    format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                    'text/csv',
        filename,
        data: JSON.stringify(reportData, null, 2)
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};