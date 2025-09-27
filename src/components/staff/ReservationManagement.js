/**
 * Gestión de Reservas - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/staff/ReservationManagement.js
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { reservationService } from '../../services/reservationService';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    start_date: '',
    end_date: '',
    search: ''
  });
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');

  const { user } = useAuth();
  const { translate } = useLanguage();

  useEffect(() => {
    loadReservations();
  }, [filters]);

  const loadReservations = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await reservationService.getAll({
        ...filters,
        page: 1,
        limit: 50
      });
      setReservations(response.data.reservations);
    } catch (err) {
      setError('Error al cargar reservas: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAction = (reservation, action) => {
    setSelectedReservation(reservation);
    setActionType(action);
    setShowModal(true);
  };

  const executeAction = async () => {
    if (!selectedReservation) return;

    setIsLoading(true);
    try {
      switch (actionType) {
        case 'confirm':
          await reservationService.confirm(selectedReservation.id);
          break;
        case 'checkin':
          await reservationService.checkIn(selectedReservation.id, 'Check-in realizado por staff');
          break;
        case 'checkout':
          await reservationService.checkOut(selectedReservation.id, 'Check-out realizado por staff');
          break;
        case 'cancel':
          const reason = prompt('Ingrese la razón de cancelación:');
          if (reason) {
            await reservationService.cancel(selectedReservation.id, reason);
          } else {
            return;
          }
          break;
        default:
          break;
      }

      setShowModal(false);
      setSelectedReservation(null);
      loadReservations();
    } catch (err) {
      setError('Error al ejecutar acción: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pendiente', color: 'yellow' },
      confirmed: { label: 'Confirmada', color: 'blue' },
      checked_in: { label: 'Check-in', color: 'green' },
      checked_out: { label: 'Check-out', color: 'gray' },
      cancelled: { label: 'Cancelada', color: 'red' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClasses[config.color]}`}>
        {config.label}
      </span>
    );
  };

  const canPerformAction = (reservation, action) => {
    switch (action) {
      case 'confirm':
        return reservation.status === 'pending';
      case 'checkin':
        return reservation.status === 'confirmed';
      case 'checkout':
        return reservation.status === 'checked_in';
      case 'cancel':
        return ['pending', 'confirmed'].includes(reservation.status);
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Gestión de Reservas
        </h3>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="select-field"
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="checked_in">Check-in</option>
              <option value="checked_out">Check-out</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desde
            </label>
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hasta
            </label>
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Código, huésped..."
              className="input-field"
            />
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <Loading message="Cargando reservas..." />
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Código</th>
                  <th className="table-header">Huésped</th>
                  <th className="table-header">Habitación</th>
                  <th className="table-header">Check-in</th>
                  <th className="table-header">Check-out</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">
                      {reservation.reservation_code}
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium">
                          {reservation.guest?.first_name} {reservation.guest?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.guest?.email}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      {reservation.room?.room_number}
                      <div className="text-sm text-gray-500 capitalize">
                        {reservation.room?.category}
                      </div>
                    </td>
                    <td className="table-cell">
                      {formatDate(reservation.check_in_date)}
                    </td>
                    <td className="table-cell">
                      {formatDate(reservation.check_out_date)}
                    </td>
                    <td className="table-cell font-medium">
                      {formatCurrency(reservation.total_amount)}
                    </td>
                    <td className="table-cell">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        {canPerformAction(reservation, 'confirm') && (
                          <button
                            onClick={() => handleAction(reservation, 'confirm')}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Confirmar
                          </button>
                        )}
                        {canPerformAction(reservation, 'checkin') && (
                          <button
                            onClick={() => handleAction(reservation, 'checkin')}
                            className="text-green-600 hover:text-green-900 text-sm"
                          >
                            Check-in
                          </button>
                        )}
                        {canPerformAction(reservation, 'checkout') && (
                          <button
                            onClick={() => handleAction(reservation, 'checkout')}
                            className="text-orange-600 hover:text-orange-900 text-sm"
                          >
                            Check-out
                          </button>
                        )}
                        {canPerformAction(reservation, 'cancel') && (
                          <button
                            onClick={() => handleAction(reservation, 'cancel')}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reservations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron reservas</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Confirmar Acción
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  ¿Está seguro que desea {actionType} la reserva {selectedReservation?.reservation_code}?
                </p>
              </div>
              <div className="flex justify-center space-x-4 px-4 py-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeAction}
                  className="btn-primary"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;