/**
 * Estado de Habitaciones - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/staff/RoomStatus.js
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { roomService } from '../../services/roomService';
import { getStatusColor } from '../../utils/helpers';

const RoomStatus = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    floor: '',
    category: ''
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  const { user } = useAuth();
  const { translate } = useLanguage();

  useEffect(() => {
    loadRooms();
  }, [filters]);

  const loadRooms = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await roomService.getAll({
        ...filters,
        page: 1,
        limit: 100
      });
      setRooms(response.data.rooms);
    } catch (err) {
      setError('Error al cargar habitaciones: ' + err.message);
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

  const handleStatusChange = (room, status) => {
    setSelectedRoom(room);
    setNewStatus(status);
    setNotes('');
    setShowModal(true);
  };

  const executeStatusChange = async () => {
    if (!selectedRoom || !newStatus) return;

    setIsLoading(true);
    try {
      await roomService.changeStatus(selectedRoom.id, {
        status: newStatus,
        notes: notes
      });

      setShowModal(false);
      setSelectedRoom(null);
      setNewStatus('');
      setNotes('');
      loadRooms();
    } catch (err) {
      setError('Error al cambiar estado: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: 'Disponible', color: 'green' },
      occupied: { label: 'Ocupada', color: 'red' },
      cleaning: { label: 'Limpieza', color: 'yellow' },
      maintenance: { label: 'Mantenimiento', color: 'orange' },
      out_of_order: { label: 'Fuera de Servicio', color: 'gray' }
    };

    const config = statusConfig[status] || statusConfig.available;
    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      orange: 'bg-orange-100 text-orange-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClasses[config.color]}`}>
        {config.label}
      </span>
    );
  };

  const getAvailableActions = (room) => {
    const actions = [];

    switch (room.status) {
      case 'available':
        if (user.role === 'receptionist' || user.role === 'manager') {
          actions.push({ status: 'occupied', label: 'Marcar Ocupada' });
        }
        actions.push({ status: 'maintenance', label: 'Mantenimiento' });
        break;
      case 'occupied':
        if (user.role === 'receptionist' || user.role === 'manager') {
          actions.push({ status: 'cleaning', label: 'Requiere Limpieza' });
        }
        break;
      case 'cleaning':
        if (user.role === 'cleaning' || user.role === 'manager') {
          actions.push({ status: 'available', label: 'Marcar Limpia' });
        }
        actions.push({ status: 'maintenance', label: 'Mantenimiento' });
        break;
      case 'maintenance':
        if (user.role === 'manager') {
          actions.push({ status: 'available', label: 'Terminar Mantenimiento' });
          actions.push({ status: 'cleaning', label: 'Enviar a Limpieza' });
        }
        break;
      case 'out_of_order':
        if (user.role === 'manager') {
          actions.push({ status: 'maintenance', label: 'Mantenimiento' });
          actions.push({ status: 'available', label: 'Poner en Servicio' });
        }
        break;
    }

    return actions;
  };

  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {translate('roomStatus')}
        </h3>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              <option value="available">Disponible</option>
              <option value="occupied">Ocupada</option>
              <option value="cleaning">Limpieza</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="out_of_order">Fuera de Servicio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Piso
            </label>
            <select
              name="floor"
              value={filters.floor}
              onChange={handleFilterChange}
              className="select-field"
            >
              <option value="">Todos</option>
              {[1, 2, 3, 4, 5].map(floor => (
                <option key={floor} value={floor}>Piso {floor}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="select-field"
            >
              <option value="">Todas</option>
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="presidential">Presidential</option>
            </select>
          </div>
        </div>

        {/* Resumen de Estados */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {['available', 'occupied', 'cleaning', 'maintenance', 'out_of_order'].map(status => {
            const count = rooms.filter(room => room.status === status).length;
            return (
              <div key={status} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {status === 'available' && 'Disponibles'}
                  {status === 'occupied' && 'Ocupadas'}
                  {status === 'cleaning' && 'Limpieza'}
                  {status === 'maintenance' && 'Mantenimiento'}
                  {status === 'out_of_order' && 'Fuera Servicio'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <Loading message="Cargando habitaciones..." />
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedRooms).sort((a, b) => parseInt(a) - parseInt(b)).map(floor => (
            <div key={floor} className="bg-white shadow rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Piso {floor}
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {groupedRooms[floor].sort((a, b) => a.room_number.localeCompare(b.room_number)).map(room => (
                  <div
                    key={room.id}
                    className={`border-2 rounded-lg p-4 text-center transition-colors ${
                      room.status === 'available' ? 'border-green-200 bg-green-50' :
                      room.status === 'occupied' ? 'border-red-200 bg-red-50' :
                      room.status === 'cleaning' ? 'border-yellow-200 bg-yellow-50' :
                      room.status === 'maintenance' ? 'border-orange-200 bg-orange-50' :
                      'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-lg">{room.room_number}</div>
                    <div className="text-xs text-gray-600 mb-2 capitalize">
                      {room.category}
                    </div>
                    <div className="mb-3">
                      {getStatusBadge(room.status)}
                    </div>
                    
                    {getAvailableActions(room).length > 0 && (
                      <div className="space-y-1">
                        {getAvailableActions(room).map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleStatusChange(room, action.status)}
                            className="w-full text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Cambio de Estado */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cambiar Estado de Habitación
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Habitación: <span className="font-medium">{selectedRoom?.room_number}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Nuevo estado: <span className="font-medium capitalize">{newStatus}</span>
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="textarea-field"
                  placeholder="Agregar notas sobre el cambio..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeStatusChange}
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

export default RoomStatus;