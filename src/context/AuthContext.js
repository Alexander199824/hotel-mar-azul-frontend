/**
 * Contexto de Autenticación - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/context/AuthContext.js
 */

/**
 * Contexto de Autenticación - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/context/AuthContext.js
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { safeStorage } from '../utils/safeStorage';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = safeStorage.getItem('authToken');
      const userData = safeStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          console.log('🔄 AuthContext: Restaurando sesión para:', user.email);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token },
          });
        } catch (error) {
          console.error('❌ AuthContext: Error al restaurar sesión:', error);
          logout();
        }
      } else {
        console.log('📝 AuthContext: No hay sesión guardada');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      console.log('🔐 AuthContext: Iniciando login...');
      const response = await authService.login(credentials);
      
      console.log('📥 AuthContext: Respuesta recibida:', response);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        console.log('✅ AuthContext: Login exitoso:', { 
          user: user.email, 
          role: user.role,
          id: user.id 
        });
        
        // Guardar en localStorage
        safeStorage.setItem('authToken', token);
        safeStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
        
        return { success: true };
      } else {
        throw new Error('Respuesta de login inválida');
      }
    } catch (error) {
      console.error('❌ AuthContext: Error en login:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { 
        success: false, 
        message: error.message || 'Error de autenticación' 
      };
    }
  };

  // ✅ NUEVA FUNCIÓN: register
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      console.log('📝 AuthContext: Iniciando registro...', {
        email: userData.email,
        username: userData.username,
        role: userData.role
      });
      
      const response = await authService.register(userData);
      
      console.log('📥 AuthContext: Respuesta de registro:', response);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        console.log('✅ AuthContext: Registro exitoso:', {
          user: user.email,
          role: user.role,
          id: user.id
        });
        
        // Guardar en localStorage (login automático)
        safeStorage.setItem('authToken', token);
        safeStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
        
        return { 
          success: true,
          message: 'Usuario registrado exitosamente'
        };
      } else {
        throw new Error('Respuesta de registro inválida');
      }
    } catch (error) {
      console.error('❌ AuthContext: Error en registro:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message ||
                          'Error al registrar usuario';
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const logout = () => {
    console.log('🚪 AuthContext: Cerrando sesión...');
    safeStorage.removeItem('authToken');
    safeStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    safeStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const hasRole = (requiredRoles) => {
    if (!state.user) return false;
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(state.user.role);
    }
    return state.user.role === requiredRoles;
  };

  const value = {
    ...state,
    login,
    register, //funcion de registro
    logout,
    updateUser,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};