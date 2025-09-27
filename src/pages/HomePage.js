/**
 * Página de Inicio - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/pages/HomePage.js
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const { translate } = useLanguage();

  const getDashboardRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'guest':
        return '/guest';
      case 'manager':
        return '/manager';
      case 'receptionist':
      case 'cleaning':
        return '/staff';
      default:
        return '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenido a
              <span className="block text-blue-600">
                {process.env.REACT_APP_HOTEL_NAME}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sistema integral de gestión hotelera diseñado para brindar 
              la mejor experiencia tanto a huéspedes como al personal del hotel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to={getDashboardRoute()}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Ir al {translate('dashboard')}
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    {translate('login')}
                  </Link>
                  <button
                    onClick={() => {
                      // TODO: Implementar búsqueda de habitaciones sin login
                      alert('Búsqueda de habitaciones próximamente');
                    }}
                    className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                  >
                    Buscar Habitaciones
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Características del Sistema */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Características del Sistema
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Funcionalidades diseñadas para optimizar la gestión hotelera 
              y mejorar la experiencia del huésped.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* HU-01: Reservas en línea */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reservas en Línea
              </h3>
              <p className="text-gray-600 text-sm">
                Sistema de reservas en tiempo real con confirmación inmediata 
                y pasarelas de pago seguras.
              </p>
            </div>

            {/* HU-02: Check-in Digital */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Check-in Digital
              </h3>
              <p className="text-gray-600 text-sm">
                Check-in y check-out digital para reducir tiempos de espera 
                y mejorar la experiencia del huésped.
              </p>
            </div>

            {/* HU-03: Multilenguaje */}
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Multilenguaje
              </h3>
              <p className="text-gray-600 text-sm">
                Interfaz disponible en múltiples idiomas con diseño 
                responsivo para todos los dispositivos.
              </p>
            </div>

            {/* RU-01: Gestión de Reservas */}
            <div className="bg-orange-50 rounded-lg p-6">
              <div className="h-12 w-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gestión de Reservas
              </h3>
              <p className="text-gray-600 text-sm">
                Panel completo para personal de recepción para gestionar 
                reservas, evitar sobreventas y coordinar servicios.
              </p>
            </div>

            {/* LU-01: Estado de Habitaciones */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Control de Habitaciones
              </h3>
              <p className="text-gray-600 text-sm">
                Sistema de seguimiento en tiempo real del estado de habitaciones 
                para el personal de limpieza y mantenimiento.
              </p>
            </div>

            {/* GU-01: Reportes */}
            <div className="bg-red-50 rounded-lg p-6">
              <div className="h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Reportes y Analytics
              </h3>
              <p className="text-gray-600 text-sm">
                Reportes detallados de ocupación, ventas y rendimiento 
                para la toma de decisiones estratégicas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Información de Contacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Teléfono
              </h3>
              <p className="text-gray-600">
                {process.env.REACT_APP_CONTACT_PHONE}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email
              </h3>
              <p className="text-gray-600">
                {process.env.REACT_APP_CONTACT_EMAIL}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;