/**
 * Contexto de Idiomas - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/context/LanguageContext.js
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  es: {
    // Navegación
    home: 'Inicio',
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    dashboard: 'Panel Principal',
    
    // Autenticación
    email: 'Correo Electrónico',
    password: 'Contraseña',
    loginButton: 'Ingresar',
    loginFailed: 'Credenciales incorrectas',
    
    // Reservas (HU-01)
    bookRoom: 'Reservar Habitación',
    checkIn: 'Fecha de Entrada',
    checkOut: 'Fecha de Salida',
    guests: 'Huéspedes',
    searchRooms: 'Buscar Habitaciones',
    confirmReservation: 'Confirmar Reserva',
    
    // Check-in/Check-out (HU-02)
    digitalCheckin: 'Check-in Digital',
    digitalCheckout: 'Check-out Digital',
    uploadDocument: 'Subir Documento',
    
    // Personal de limpieza (LU-01, LU-02)
    roomStatus: 'Estado de Habitaciones',
    reportIncident: 'Reportar Incidencia',
    available: 'Disponible',
    occupied: 'Ocupada',
    cleaning: 'Limpieza',
    maintenance: 'Mantenimiento',
    
    // Reportes (GU-01, GU-02)
    occupancyReport: 'Reporte de Ocupación',
    salesReport: 'Reporte de Ventas',
    generateReport: 'Generar Reporte',
    
    // Errores y mensajes
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    noData: 'No hay datos disponibles',
  },
  en: {
    // Navigation
    home: 'Home',
    login: 'Login',
    logout: 'Logout',
    dashboard: 'Dashboard',
    
    // Authentication
    email: 'Email',
    password: 'Password',
    loginButton: 'Sign In',
    loginFailed: 'Invalid credentials',
    
    // Reservations (HU-01)
    bookRoom: 'Book Room',
    checkIn: 'Check-in Date',
    checkOut: 'Check-out Date',
    guests: 'Guests',
    searchRooms: 'Search Rooms',
    confirmReservation: 'Confirm Reservation',
    
    // Check-in/Check-out (HU-02)
    digitalCheckin: 'Digital Check-in',
    digitalCheckout: 'Digital Check-out',
    uploadDocument: 'Upload Document',
    
    // Cleaning staff (LU-01, LU-02)
    roomStatus: 'Room Status',
    reportIncident: 'Report Incident',
    available: 'Available',
    occupied: 'Occupied',
    cleaning: 'Cleaning',
    maintenance: 'Maintenance',
    
    // Reports (GU-01, GU-02)
    occupancyReport: 'Occupancy Report',
    salesReport: 'Sales Report',
    generateReport: 'Generate Report',
    
    // Errors and messages
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noData: 'No data available',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || process.env.REACT_APP_DEFAULT_LANGUAGE || 'es'
  );

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const translate = (key) => {
    return translations[language]?.[key] || key;
  };

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const value = {
    language,
    translate,
    changeLanguage,
    supportedLanguages: Object.keys(translations),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser usado dentro de LanguageProvider');
  }
  return context;
};