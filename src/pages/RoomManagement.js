/**
 * Componente de gestión de habitaciones
 * Archivo: /src/components/rooms/RoomManagement.js
 */

import React, { useState, useEffect } from 'react';
import { roomService as roomServices } from '../services/roomService';
import RoomFormModal from './RoomFormModal';
import { formatCurrency } from '../utils/helpers';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    floor: ''
  });

  useEffect(() => {
    loadRooms();
  }, [filters]);

  const loadRooms = async () => {
    setLoading(true);
    setError('');

    try {
      // Normalizar filtros (sin mayúsculas)
      const cleanFilters = {};

      if (filters.status && filters.status.trim() !== '') {
        cleanFilters.status = filters.status;
      }

      if (filters.category && filters.category.trim() !== '') {
        cleanFilters.category = filters.category;
      }

      if (filters.floor && filters.floor !== '') {
        cleanFilters.floor = Number(filters.floor);
      }

      // Llamar al servicio de habitaciones
      const response = await roomServices.getAll(cleanFilters);
      setRooms(response.data?.data?.rooms || response.data?.data || []);
    } catch (err) {
      console.error('Error cargando habitaciones:', err);
      setError('Error al cargar habitaciones: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('¿Está seguro de desactivar esta habitación?')) return;

    try {
      await roomServices.delete(roomId);
      loadRooms();
    } catch (err) {
      alert('Error al desactivar habitación: ' + err.message);
    }
  };

  const handleModalSuccess = () => {
    loadRooms();
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Disponible' },
      occupied: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ocupada' },
      cleaning: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Limpieza' },
      maintenance: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Mantenimiento' },
      out_of_service: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Fuera de Servicio' }
    };

    const badge = badges[status?.toLowerCase()] || badges.available;

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getCategoryLabel = (category) => {
    const labels = {
      standard: 'Estándar',
      superior: 'Superior',
      deluxe: 'Deluxe',
      suite: 'Suite',
      presidential: 'Presidencial'
    };
    return labels[category?.toLowerCase()] || category;
  };

  return (
    <div className="space-y-6">
      {/* Header y Filtros */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Habitaciones</h2>
          <button
            onClick={handleCreateRoom}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Habitación
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="available">Disponible</option>
              <option value="occupied">Ocupada</option>
              <option value="cleaning">Limpieza</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="out_of_service">Fuera de Servicio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              <option value="standard">Estándar</option>
              <option value="superior">Superior</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="presidential">Presidencial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Piso
            </label>
            <input
              type="number"
              value={filters.floor}
              onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
              placeholder="Todos"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Lista de habitaciones */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando habitaciones...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay habitaciones</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva habitación.</p>
          <button
            onClick={handleCreateRoom}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Nueva Habitación
          </button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Habitación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Piso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{room.room_number}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{room.room_number}</div>
                        <div className="text-sm text-gray-500">{room.beds_count} {room.bed_type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getCategoryLabel(room.category)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Piso {room.floor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.capacity} personas</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(room.base_price)}</div>
                    <div className="text-xs text-gray-500">{room.currency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(room.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEditRoom(room)} className="text-blue-600 hover:text-blue-900 mr-4" title="Editar">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDeleteRoom(room.id)} className="text-red-600 hover:text-red-900" title="Eliminar">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <RoomFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        roomToEdit={selectedRoom}
      />
    </div>
  );
};

export default RoomManagement;
