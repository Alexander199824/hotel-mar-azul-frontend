/**
 * Portal del Huésped - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/pages/GuestPortal.js
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import BookingForm from '../components/guest/BookingForm';
import CheckInForm from '../components/guest/CheckInForm';
import CheckOutForm from '../components/guest/CheckOutForm';

const GuestPortal = () => {
  const { user } = useAuth();
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState('booking');

  const tabs = [
    { id: 'booking', label: translate('bookRoom'), icon: 'calendar' },
    { id: 'checkin', label: translate('digitalCheckin'), icon: 'login' },
    { id: 'checkout', label: translate('digitalCheckout'), icon: 'logout' },
  ];

  const renderIcon = (iconType) => {
    const iconClasses = "h-5 w-5";
    
    switch (iconType) {
      case 'calendar':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'login':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        );
      case 'logout':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'booking':
        return <BookingForm />;
      case 'checkin':
        return <CheckInForm />;
      case 'checkout':
        return <CheckOutForm />;
      default:
        return <BookingForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del Portal */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Portal del Huésped
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenido, {user?.first_name} {user?.last_name}
          </p>
        </div>

        {/* Navegación por tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                >
                  {renderIcon(tab.icon)}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido del tab activo */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Mis Reservas Activas
            </h3>
            <div className="text-sm text-gray-600">
              <p>No tienes reservas activas en este momento.</p>
              <p className="mt-2">
                Utiliza la pestaña "Reservar Habitación" para hacer una nueva reserva.
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Servicios Disponibles
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">WiFi Gratuito</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Servicio a la Habitación</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Spa y Wellness</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestPortal;