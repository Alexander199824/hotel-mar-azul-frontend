/**
 * Gestión de Habitaciones - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/manager/RoomManagement.js
 */

import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/roomService';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    room_number: '',
    floor: 1,
    category: 'standard',
    base_price: '',
    capacity: 2,
    beds_count: 1,
    bed_type: 'doble',
    description: '',
    amenities: [],
    has_balcony: false,
    has_ocean_view: false,
    has_wifi: true,
    has_air_conditioning: true,
    has_minibar: false,
    has_safe: false
  });

  const categories = [
    { value: 'standard', label: 'Standard', price: 300 },
    { value: 'deluxe', label: 'Deluxe', price: 500 },
    { value: 'suite', label: 'Suite', price: 800 },
    { value: 'presidential', label: 'Presidential', price: 1500 }
  ];

  const amenitiesList = [
    'WiFi', 'TV', 'Mini Bar', 'Aire Acondicionado',
    'Caja Fuerte', 'Balcón', 'Jacuzzi', 'Vista al Mar'
  ];

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await roomService.getAll({ page: 1, limit: 100 });
      setRooms(response.data.rooms || []);
    } catch (err) {
      setError('Error al cargar habitaciones: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'amenities') {
      const currentAmenities = formData.amenities || [];
      if (checked) {
        setFormData(prev => ({
          ...prev,
          amenities: [...currentAmenities, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          amenities: currentAmenities.filter(a => a !== value)
        }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      // Permitir valores vacíos para campos numéricos
      const numValue = value === '' ? '' : parseFloat(value);

      // Si es el campo de capacidad, actualizar automáticamente solo el tipo de cama
      // El número de camas lo decide el usuario manualmente
      if (name === 'capacity' && numValue !== '') {
        let bedType = 'doble';

        if (numValue === 1) {
          bedType = 'individual';
        } else if (numValue === 2) {
          bedType = 'doble';
        } else if (numValue === 3 || numValue === 4) {
          bedType = 'queen';
        } else if (numValue >= 5) {
          bedType = 'king';
        }

        setFormData(prev => ({
          ...prev,
          capacity: numValue,
          bed_type: bedType
          // beds_count NO se actualiza - el usuario lo decide manualmente
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: numValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const categoryInfo = categories.find(c => c.value === category);

    setFormData(prev => ({
      ...prev,
      category: category,
      base_price: categoryInfo?.price || prev.base_price
    }));
  };

  const openCreateModal = () => {
    setEditingRoom(null);
    setFormData({
      room_number: '',
      floor: 1,
      category: 'standard',
      base_price: 300,
      capacity: 2,
      beds_count: 1,
      bed_type: 'double',
      description: '',
      amenities: [],
      has_balcony: false,
      has_ocean_view: false,
      has_wifi: true,
      has_air_conditioning: true,
      has_minibar: false,
      has_safe: false
    });
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      room_number: room.room_number,
      floor: room.floor,
      category: room.category,
      base_price: room.base_price,
      capacity: room.capacity,
      beds_count: room.beds_count || 1,
      bed_type: room.bed_type || 'doble',
      description: room.description || '',
      amenities: room.amenities || [],
      has_balcony: room.has_balcony || false,
      has_ocean_view: room.has_ocean_view || false,
      has_wifi: room.has_wifi !== false,
      has_air_conditioning: room.has_air_conditioning !== false,
      has_minibar: room.has_minibar || false,
      has_safe: room.has_safe || false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Limpiar y validar datos antes de enviar
      const cleanedData = {
        ...formData,
        room_number: formData.room_number.trim().toUpperCase(),
        base_price: parseFloat(formData.base_price) || 300,
        capacity: parseInt(formData.capacity) || 1,
        beds_count: parseInt(formData.beds_count) || 1,
        floor: parseInt(formData.floor) || 1,
        currency: 'GTQ',
        amenities: formData.amenities || [],
        description: formData.description || ''
      };

      if (editingRoom) {
        await roomService.update(editingRoom.id, cleanedData);
      } else {
        await roomService.create(cleanedData);
      }

      setShowModal(false);
      loadRooms();
    } catch (err) {
      setError(err.message || 'Error al guardar habitación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('¿Está seguro de eliminar esta habitación?')) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await roomService.delete(roomId);
      loadRooms();
    } catch (err) {
      setError('Error al eliminar habitación: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: 'Disponible', color: 'bg-green-100 text-green-800' },
      occupied: { label: 'Ocupada', color: 'bg-red-100 text-red-800' },
      cleaning: { label: 'Limpieza', color: 'bg-yellow-100 text-yellow-800' },
      maintenance: { label: 'Mantenimiento', color: 'bg-orange-100 text-orange-800' },
      out_of_order: { label: 'Fuera de Servicio', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig.available;

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Administración de Habitaciones
          </h3>
          <button
            onClick={openCreateModal}
            className="btn-primary"
          >
            + Nueva Habitación
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        {isLoading ? (
          <Loading message="Cargando habitaciones..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Piso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {room.room_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Piso {room.floor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {room.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Q{room.base_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.capacity} personas
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(room.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openEditModal(room)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {rooms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay habitaciones registradas</p>
                <button
                  onClick={openCreateModal}
                  className="mt-4 btn-primary"
                >
                  Crear Primera Habitación
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRoom ? 'Editar Habitación' : 'Nueva Habitación'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Habitación *
                    </label>
                    <input
                      type="text"
                      name="room_number"
                      value={formData.room_number}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Ej: 101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Piso *
                    </label>
                    <select
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      required
                      className="select-field"
                    >
                      {[1, 2, 3, 4, 5].map(floor => (
                        <option key={floor} value={floor}>Piso {floor}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      required
                      className="select-field"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Base (Q) *
                    </label>
                    <input
                      type="number"
                      name="base_price"
                      value={formData.base_price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidad (personas) *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="10"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Camas *
                    </label>
                    <input
                      type="number"
                      name="beds_count"
                      value={formData.beds_count}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="5"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Cama *
                  </label>
                  <select
                    name="bed_type"
                    value={formData.bed_type}
                    onChange={handleInputChange}
                    required
                    className="select-field"
                  >
                    <option value="individual">Individual</option>
                    <option value="doble">Doble</option>
                    <option value="queen">Queen</option>
                    <option value="king">King</option>
                    <option value="sofa_cama">Sofá Cama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="textarea-field"
                    placeholder="Descripción de la habitación..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Características
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="has_wifi"
                        checked={formData.has_wifi}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">WiFi</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="has_air_conditioning"
                        checked={formData.has_air_conditioning}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Aire Acondicionado</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="has_minibar"
                        checked={formData.has_minibar}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Mini Bar</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="has_safe"
                        checked={formData.has_safe}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Caja Fuerte</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="has_balcony"
                        checked={formData.has_balcony}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Balcón</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="has_ocean_view"
                        checked={formData.has_ocean_view}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Vista al Mar</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {editingRoom ? 'Actualizar' : 'Crear'} Habitación
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
