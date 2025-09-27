/**
 * Dashboard del Personal - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/pages/StaffDashboard.js
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';
import ReservationManagement from '../components/staff/ReservationManagement';
import RoomStatus from '../components/staff/RoomStatus';
import IncidentReport from '../components/staff/IncidentReport';
import { roomService } from '../services/roomService';
import { reservationService } from '../services/reservationService';

const StaffDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const { user } = useAuth();
  const { translate } = useLanguage();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [roomsResponse, reservationsResponse] = await Promise.all([
        roomService.getStats(),
        reservationService.getStats(
          new Date().toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        )
      ]);

      setDashboardData({
        rooms: roomsResponse.data,
        reservations: reservationsResponse.data
      });
    } catch (err) {
      setError('Error al cargar dashboard: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTabsForRole = () => {
    const baseTabs = [
      { id: 'overview', label: 'Resumen', icon: 'home', roles: ['receptionist', 'cleaning', 'manager'] }
    ];

    if (user.role === 'receptionist' || user.role === 'manager') {
      baseTabs.push(
        { id: 'reservations', label: 'Reservas', icon: 'calendar', roles: ['receptionist', 'manager'] },
        { id: 'rooms', label: 'Habitaciones', icon: 'building', roles: ['receptionist', 'cleaning', 'manager'] }
      );
    }

    if (user.role === 'cleaning' || user.role === 'manager') {
      baseTabs.push(
        { id: 'rooms', label: 'Habitaciones', icon: 'building', roles: ['cleaning', 'manager'] },
        { id: 'incidents', label: 'Incidencias', icon: 'exclamation', roles: ['cleaning', 'manager'] }
      );
    }

    return baseTabs.filter(tab => tab.roles.includes(user.role));
  };

  const renderIcon = (iconType) => {
    const iconClasses = "h-5 w-5";
    
    switch (iconType) {
      case 'home':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'building':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'exclamation':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Habitaciones Disponibles
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {dashboardData?.rooms?.summary?.available_rooms || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Habitaciones Ocupadas
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {dashboardData?.rooms?.summary?.occupied_rooms || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Requieren Limpieza
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {dashboardData?.rooms?.summary?.rooms_cleaning || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Check-ins Hoy
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {dashboardData?.reservations?.statistics?.checkins_today || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Tareas Pendientes */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tareas Pendientes
        </h3>
        <div className="space-y-4">
          {user.role === 'receptionist' && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium text-blue-900">Reservas Pendientes</h4>
                <p className="text-sm text-blue-700">
                  {dashboardData?.reservations?.statistics?.pending_reservations || 0} reservas requieren confirmación
                </p>
              </div>
              <button
                onClick={() => setActiveTab('reservations')}
                className="btn-primary"
              >
                Ver Reservas
              </button>
            </div>
          )}

          {user.role === 'cleaning' && (
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <h4 className="font-medium text-yellow-900">Habitaciones por Limpiar</h4>
                <p className="text-sm text-yellow-700">
                  {dashboardData?.rooms?.summary?.rooms_cleaning || 0} habitaciones requieren limpieza
                </p>
              </div>
              <button
                onClick={() => setActiveTab('rooms')}
                className="btn-primary"
              >
                Ver Habitaciones
              </button>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div>
              <h4 className="font-medium text-orange-900">Incidencias Abiertas</h4>
              <p className="text-sm text-orange-700">
                {dashboardData?.rooms?.summary?.open_incidents || 0} incidencias requieren atención
              </p>
            </div>
            <button
              onClick={() => setActiveTab('incidents')}
              className="btn-primary"
            >
              Ver Incidencias
            </button>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Accesos Rápidos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {user.role === 'receptionist' && (
            <>
              <button className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="text-2xl mb-2">🏨</div>
                <div className="text-sm font-medium">Nueva Reserva</div>
              </button>
              <button className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="text-2xl mb-2">✅</div>
                <div className="text-sm font-medium">Check-in</div>
              </button>
              <button className="p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <div className="text-2xl mb-2">🔑</div>
                <div className="text-sm font-medium">Check-out</div>
              </button>
            </>
          )}
          
          {(user.role === 'cleaning' || user.role === 'manager') && (
            <button className="p-4 text-center bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="text-sm font-medium">Reportar Incidencia</div>
            </button>
          )}

          <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium">Reportes</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'reservations':
        return <ReservationManagement />;
      case 'rooms':
        return <RoomStatus />;
      case 'incidents':
        return (
          <IncidentReport 
            onSubmit={async (data) => {
              console.log('Incidencia reportada:', data);
              // Aquí iría la lógica para enviar la incidencia
            }}
          />
        );
      default:
        return renderOverview();
    }
  };

  const tabs = getTabsForRole();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Trabajo
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenido, {user?.first_name} {user?.last_name} - {user?.role === 'receptionist' ? 'Recepcionista' : user?.role === 'cleaning' ? 'Personal de Limpieza' : 'Manager'}
          </p>
        </div>

        {/* Navegación por tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                >
                  {renderIcon(tab.icon)}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido */}
        {error && <ErrorMessage message={error} />}

        {isLoading ? (
          <Loading message="Cargando dashboard..." />
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;