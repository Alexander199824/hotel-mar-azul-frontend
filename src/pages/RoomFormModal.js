/**
 * Modal de formulario para crear/editar habitaciones
 * Archivo: /src/components/rooms/RoomFormModal.js
 */

import React, { useState, useEffect } from 'react';
import { roomService } from '../services/roomService';

const RoomFormModal = ({ isOpen, onClose, onSuccess, roomToEdit = null }) => {
  const [formData, setFormData] = useState({
    room_number: '',
    category: 'standard',
    floor: 1,
    capacity: 2,
    beds_count: 1,
    bed_type: 'queen',
    base_price: 0,
    currency: 'GTQ',
    amenities: [],
    description: '',
    has_balcony: false,
    has_ocean_view: false,
    has_wifi: true,
    has_air_conditioning: true,
    has_minibar: false,
    has_safe: false,
    images: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'standard', label: 'Estándar' },
    { value: 'superior', label: 'Superior' },
    { value: 'deluxe', label: 'Deluxe' },
    { value: 'suite', label: 'Suite' },
    { value: 'presidential', label: 'Presidencial' }
  ];

  const bedTypes = [
    { value: 'individual', label: 'Individual' },
    { value: 'matrimonial', label: 'Matrimonial' },
    { value: 'queen', label: 'Queen' },
    { value: 'king', label: 'King' }
  ];

  const availableAmenities = [
    'TV por cable',
    'Teléfono',
    'Escritorio',
    'Cafetera',
    'Secador de pelo',
    'Plancha',
    'Sala de estar',
    'Bañera',
    'Ducha tipo lluvia',
    'Artículos de tocador premium'
  ];

  useEffect(() => {
    if (roomToEdit) {
      setFormData(roomToEdit);
    }
  }, [roomToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const dataToSend = {
      ...formData,
      floor: parseInt(formData.floor),
      capacity: parseInt(formData.capacity),
      beds_count: parseInt(formData.beds_count),
      base_price: parseFloat(formData.base_price)
    };

    try {
      if (roomToEdit) {
        await roomService.update(roomToEdit.id, dataToSend);
      } else {
        await roomService.create(dataToSend);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Error al guardar la habitación');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {roomToEdit ? 'Editar Habitación' : 'Nueva Habitación'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número de Habitación *
              </label>
              <input
                type="text"
                name="room_number"
                value={formData.room_number}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ej: 101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Piso *
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                required
                min="1"
                max="20"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Capacidad y Camas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacidad *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número de Camas *
              </label>
              <input
                type="number"
                name="beds_count"
                value={formData.beds_count}
                onChange={handleChange}
                required
                min="1"
                max="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Cama *
              </label>
              <select
                name="bed_type"
                value={formData.bed_type}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {bedTypes.map((bed) => (
                  <option key={bed.value} value={bed.value}>
                    {bed.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Precio Base *
              </label>
              <input
                type="number"
                name="base_price"
                value={formData.base_price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Moneda
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="GTQ">GTQ (Quetzales)</option>
                <option value="USD">USD (Dólares)</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Descripción de la habitación..."
            />
          </div>

          {/* Características */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Características
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="has_balcony"
                  checked={formData.has_balcony}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Balcón</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="has_ocean_view"
                  checked={formData.has_ocean_view}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Vista al Mar</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="has_wifi"
                  checked={formData.has_wifi}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">WiFi</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="has_air_conditioning"
                  checked={formData.has_air_conditioning}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Aire Acondicionado</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="has_minibar"
                  checked={formData.has_minibar}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Minibar</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="has_safe"
                  checked={formData.has_safe}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Caja Fuerte</span>
              </label>
            </div>
          </div>

          {/* Amenidades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenidades Adicionales
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Guardando...' : roomToEdit ? 'Actualizar' : 'Crear Habitación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomFormModal;

