/**
 * Archivo Principal - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/index.js
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Configuración para desarrollo
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Habilitar React Developer Tools
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};

  // Log de información del entorno
  console.log('Hotel Mar Azul - Sistema de Gestión Hotelera');
  console.log('Desarrollado por: Alexander Echeverria');
  console.log('Entorno:', process.env.NODE_ENV);
  console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
}

// Función para manejar errores no capturados (solo en navegador)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Error no manejado:', event.reason);

    // En desarrollo, mostrar error en consola
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', event.reason.stack);
    }

    // Prevenir que el error se propague
    event.preventDefault();
  });

  // Función para manejar errores de JavaScript
  window.addEventListener('error', (event) => {
    console.error('Error de JavaScript:', event.error);

    if (process.env.NODE_ENV === 'development') {
      console.error('Detalles del error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    }
  });
}

// Crear el root de React (solo en navegador)
if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    // Renderizar la aplicación
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

// Service Worker para PWA (opcional) - solo en navegador
if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW falló: ', registrationError);
      });
  });
}