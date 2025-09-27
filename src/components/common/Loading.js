/**
 * Componentes Comunes - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/common/Loading.js
 */

import React from 'react';

export const Loading = ({ message = 'Cargando...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
      {message && <p className="mt-4 text-gray-600 text-sm">{message}</p>}
    </div>
  );
};

/**
 * Componente de Mensaje de Error
 * Archivo: /src/components/common/ErrorMessage.js
 */

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-red-400" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Intentar nuevamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Componente Footer
 * Archivo: /src/components/common/Footer.js
 */

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {process.env.REACT_APP_HOTEL_NAME}
            </h3>
            <p className="text-gray-300 text-sm">
              Sistema de gestión hotelera integral para brindar 
              la mejor experiencia a nuestros huéspedes.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Teléfono: {process.env.REACT_APP_CONTACT_PHONE}</p>
              <p>Email: {process.env.REACT_APP_CONTACT_EMAIL}</p>
              <p>Salamá, Baja Verapaz, Guatemala</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <div className="space-y-2 text-sm">
              <a href="/" className="text-gray-300 hover:text-white block">
                Inicio
              </a>
              <a href="/login" className="text-gray-300 hover:text-white block">
                Acceso Personal
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>&copy; 2024 {process.env.REACT_APP_HOTEL_NAME}. Desarrollado por Alexander Echeverria.</p>
        </div>
      </div>
    </footer>
  );
};

export default { Loading, ErrorMessage, Footer };