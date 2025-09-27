/**
 * Componentes de Loading - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/common/Loading.js
 */

import React from 'react';

// Componente principal de Loading
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

// Componente de loading inline
export const InlineLoading = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
  );
};

// Componente de loading para botones
export const ButtonLoading = ({ size = 'sm' }) => {
  return (
    <div className="flex items-center justify-center">
      <InlineLoading size={size} />
      <span className="ml-2">Cargando...</span>
    </div>
  );
};

// Loading de página completa
export const PageLoading = ({ message = 'Cargando página...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading message={message} size="lg" />
    </div>
  );
};

// Export por defecto
export default Loading;