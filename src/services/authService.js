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
      console.log('🔐 AuthService: Intentando login con:', { 
        credential: credentials.credential,
        passwordLength: credentials.password?.length 
      });
      
      const response = await apiMethods.post('/auth/login', credentials);
      
      console.log('📥 AuthService: Respuesta del servidor:', response.data);
      
      // Manejar ambos formatos de respuesta del backend
      if (response.data.success) {
        // Formato: { success: true, data: { user, token } }
        console.log('✅ AuthService: Formato con success detectado');
        return {
          success: true,
          data: response.data.data
        };
      } else if (response.data.user && response.data.token) {
        // Formato directo: { user, token }
        console.log('✅ AuthService: Formato directo detectado');
        return {
          success: true,
          data: response.data
        };
      } else {
        console.error('❌ AuthService: Formato de respuesta inválido:', response.data);
        throw new Error('Formato de respuesta inválido del servidor');
      }
    } catch (error) {
      console.error('❌ AuthService: Error en login:', error);
      console.error('📋 AuthService: Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      
      throw new Error(handleApiError(error));
    }
  },

  // Registro de usuario
  register: async (userData) => {
    try {
      console.log('📝 AuthService: Registrando usuario:', userData.email);
      const response = await apiMethods.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Error en registro:', error);
      throw new Error(handleApiError(error));
    }
  },

  // Logout
  logout: async () => {
    try {
      console.log('🚪 AuthService: Haciendo logout...');
      await apiMethods.post('/auth/logout');
    } catch (error) {
      console.error('⚠️ AuthService: Error durante logout:', error);
      // No lanzar error en logout, solo log
    }
  },

  // Obtener perfil actual
  getProfile: async () => {
    try {
      console.log('👤 AuthService: Obteniendo perfil...');
      const response = await apiMethods.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Error obteniendo perfil:', error);
      throw new Error(handleApiError(error));
    }
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    try {
      console.log('📝 AuthService: Actualizando perfil...');
      const response = await apiMethods.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Error actualizando perfil:', error);
      throw new Error(handleApiError(error));
    }
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    try {
      console.log('🔒 AuthService: Cambiando contraseña...');
      const response = await apiMethods.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Error cambiando contraseña:', error);
      throw new Error(handleApiError(error));
    }
  },

  // Solicitar recuperación de contraseña
  requestPasswordReset: async (email) => {
    try {
      console.log('📧 AuthService: Solicitando reset de contraseña para:', email);
      const response = await apiMethods.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Error en reset de contraseña:', error);
      throw new Error(handleApiError(error));
    }
  },

  // Validar token
  validateToken: async () => {
    try {
      console.log('🔍 AuthService: Validando token...');
      const response = await apiMethods.get('/auth/validate-token');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Error validando token:', error);
      throw new Error(handleApiError(error));
    }
  },

  // Obtener configuración pública
  getPublicConfig: async () => {
    try {
      console.log('⚙️ AuthService: Obteniendo configuración pública...');
      const response = await apiMethods.get('/auth/config');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Error obteniendo configuración:', error);
      throw new Error(handleApiError(error));
    }
  },
};