/**
 * Formulario de Nueva Reserva - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/staff/NewReservationForm.js
 */

import React, { useState, useEffect } from 'react';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { roomService } from '../../services/roomService';
import { reservationService } from '../../services/reservationService';
import { guestService } from '../../services/guestService';

const NewReservationForm = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState(1); // 1: búsqueda habitaciones, 2: selección, 3: datos del huésped
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [searchData, setSearchData] = useState({
    check_in_date: '',
    check_out_date: '',
    capacity: 2,
  });

  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [reservationData, setReservationData] = useState({
    adults_count: 2,
    children_count: 0,
    special_requests: '',
  });

  const [guestData, setGuestData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    document_type: 'passport',
    document_number: '',
    document_country: 'GT'
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    const newValue = parseInt(value);

    setReservationData(prev => {
      const updated = { ...prev, [name]: newValue };

      // Si se cambian los adultos y ahora ocupan toda la capacidad, poner niños en 0
      if (name === 'adults_count' && newValue >= selectedRoom.capacity) {
        updated.children_count = 0;
      }

      // Si se intenta poner adultos en 0 pero hay niños, no permitir
      if (name === 'adults_count' && newValue === 0 && prev.children_count > 0) {
        updated.children_count = 0;
      }

      return updated;
    });
    setError('');
  };

  const handleGuestChange = (e) => {
    const { name, value } = e.target;
    setGuestData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const searchRooms = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validar fechas
      const checkIn = new Date(searchData.check_in_date);
      const checkOut = new Date(searchData.check_out_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        setError('La fecha de check-in no puede ser anterior a hoy');
        setIsLoading(false);
        return;
      }

      if (checkOut <= checkIn) {
        setError('La fecha de check-out debe ser posterior a la fecha de check-in');
        setIsLoading(false);
        return;
      }

      const response = await roomService.searchAvailable(searchData);
      setAvailableRooms(response.data.rooms);

      if (response.data.rooms.length === 0) {
        setError('No hay habitaciones disponibles en las fechas seleccionadas. Por favor, intente con fechas diferentes.');
      } else {
        setStep(2);
      }
    } catch (err) {
      if (err.message.includes('no hay habitaciones disponibles')) {
        setError('No hay habitaciones disponibles en las fechas seleccionadas. Por favor, intente con fechas diferentes.');
      } else {
        setError('Error al buscar habitaciones: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setStep(3);
  };

  const createReservation = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // Validar datos del huésped
      if (!guestData.email || !guestData.email.includes('@')) {
        setError('Debe ingresar un email válido del huésped');
        setIsLoading(false);
        return;
      }

      if (!guestData.first_name || !guestData.last_name) {
        setError('Debe ingresar nombre y apellido del huésped');
        setIsLoading(false);
        return;
      }

      if (!guestData.phone) {
        setError('Debe ingresar el teléfono del huésped');
        setIsLoading(false);
        return;
      }

      if (!guestData.document_number) {
        setError('Debe ingresar el número de documento del huésped');
        setIsLoading(false);
        return;
      }

      // Validar que adultos + niños no excedan la capacidad
      const adultsCount = parseInt(reservationData.adults_count);
      const childrenCount = parseInt(reservationData.children_count);
      const totalGuests = adultsCount + childrenCount;

      if (totalGuests > selectedRoom.capacity) {
        setError(`El número total de huéspedes (${totalGuests}) excede la capacidad de la habitación (${selectedRoom.capacity})`);
        setIsLoading(false);
        return;
      }

      // Validar que si hay niños, debe haber al menos un adulto
      if (childrenCount > 0 && adultsCount === 0) {
        setError('Debe haber al menos un adulto para poder incluir niños en la reserva');
        setIsLoading(false);
        return;
      }

      // Validar que si los adultos ocupan toda la capacidad, no puede haber niños
      if (adultsCount >= selectedRoom.capacity && childrenCount > 0) {
        setError(`La habitación tiene capacidad para ${selectedRoom.capacity} personas. Si hay ${adultsCount} adultos, no se pueden agregar niños`);
        setIsLoading(false);
        return;
      }

      // Paso 1: Buscar si el huésped existe por email
      console.log('🔍 Buscando huésped por email:', guestData.email);
      let guestId = null;

      try {
        const searchResponse = await guestService.searchByEmail(guestData.email);

        if (searchResponse.data && searchResponse.data.guests && searchResponse.data.guests.length > 0) {
          // Huésped encontrado
          guestId = searchResponse.data.guests[0].id;
          console.log('✅ Huésped encontrado con ID:', guestId);
        }
      } catch (searchError) {
        console.log('ℹ️ Huésped no encontrado, se creará uno nuevo');
      }

      // Paso 2: Si no existe, crear el huésped
      if (!guestId) {
        console.log('📝 Creando nuevo huésped...');
        const createGuestPayload = {
          first_name: guestData.first_name.trim(),
          last_name: guestData.last_name.trim(),
          email: guestData.email.trim().toLowerCase(),
          phone: guestData.phone.trim(),
          document_type: guestData.document_type,
          document_number: guestData.document_number.trim(),
          document_country: guestData.document_country
        };

        const guestResponse = await guestService.create(createGuestPayload);
        guestId = guestResponse.data.guest.id;
        console.log('✅ Huésped creado con ID:', guestId);
      }

      // Paso 3: Crear la reserva con el guest_id
      const reservationPayload = {
        guest_id: guestId,  // ✅ Usar guest_id en lugar de guest_email
        room_id: selectedRoom.id,
        check_in_date: searchData.check_in_date,
        check_out_date: searchData.check_out_date,
        adults_count: parseInt(reservationData.adults_count),
        children_count: parseInt(reservationData.children_count),
        special_requests: reservationData.special_requests || '',
      };

      console.log('📝 Payload de reserva antes de enviar:', reservationPayload);

      const response = await reservationService.create(reservationPayload);

      setSuccessMessage(`Reserva creada exitosamente! Código: ${response.data.reservation.reservation_code}`);

      // Llamar a onSuccess después de un breve delay para que se vea el mensaje
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(response.data.reservation);
        }
      }, 2000);

    } catch (err) {
      setError('Error al crear reserva: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedRoom(null);
    } else if (step === 3) {
      setStep(2);
    }
  };

  // Paso 1: Búsqueda de habitaciones
  if (step === 1) {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Nueva Reserva - Buscar Habitaciones Disponibles
        </h3>

        <form onSubmit={searchRooms} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Check-in *
              </label>
              <input
                type="date"
                name="check_in_date"
                value={searchData.check_in_date}
                onChange={handleSearchChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Check-out *
              </label>
              <input
                type="date"
                name="check_out_date"
                value={searchData.check_out_date}
                onChange={handleSearchChange}
                min={searchData.check_in_date || new Date().toISOString().split('T')[0]}
                required
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Huéspedes *
            </label>
            <select
              name="capacity"
              value={searchData.capacity}
              onChange={handleSearchChange}
              className="select-field"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Huésped' : 'Huéspedes'}
                </option>
              ))}
            </select>
          </div>

          {error && <ErrorMessage message={error} />}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Buscando...' : 'Buscar Habitaciones'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Paso 2: Selección de habitación
  if (step === 2) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Habitaciones Disponibles ({availableRooms.length})
          </h3>
          <button
            onClick={() => setStep(1)}
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            Modificar Búsqueda
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-4 mb-4">
          {availableRooms.map((room) => (
            <div
              key={room.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900">
                    Habitación {room.room_number}
                  </h4>
                  <p className="text-sm text-gray-600 capitalize mb-2">
                    {room.category} - Piso {room.floor}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Capacidad: {room.capacity} huéspedes</p>
                    <p>Camas: {room.beds_count} ({room.bed_type})</p>
                    {room.has_ocean_view && (
                      <p className="text-green-600">✓ Vista al mar</p>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xl font-bold text-blue-600">
                    Q{room.pricing?.totalPrice || room.base_price}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    {room.pricing?.nights || 1} noche(s)
                  </p>
                  <button
                    onClick={() => selectRoom(room)}
                    className="btn-primary text-sm py-1 px-3"
                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  // Paso 3: Datos del huésped y confirmación
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Datos de la Reserva
      </h3>

      {/* Resumen de la habitación */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-2">
          Habitación {selectedRoom?.room_number} - {selectedRoom?.category}
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>Check-in: {searchData.check_in_date}</div>
          <div>Check-out: {searchData.check_out_date}</div>
          <div>Capacidad: {selectedRoom?.capacity} huéspedes</div>
          <div>Piso: {selectedRoom?.floor}</div>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="flex justify-between font-medium text-gray-900">
            <span>Total:</span>
            <span className="text-lg">Q{selectedRoom?.pricing?.totalPrice || selectedRoom?.base_price}</span>
          </div>
        </div>
      </div>

      <form onSubmit={createReservation} className="space-y-4">
        {/* Datos del huésped */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Información del Huésped</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="first_name"
                value={guestData.first_name}
                onChange={handleGuestChange}
                placeholder="Juan"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                name="last_name"
                value={guestData.last_name}
                onChange={handleGuestChange}
                placeholder="Pérez"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={guestData.email}
                onChange={handleGuestChange}
                placeholder="ejemplo@correo.com"
                required
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Se enviará la confirmación de reserva a este email
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                name="phone"
                value={guestData.phone}
                onChange={handleGuestChange}
                placeholder="+502 1234-5678"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento *
              </label>
              <select
                name="document_type"
                value={guestData.document_type}
                onChange={handleGuestChange}
                className="select-field"
              >
                <option value="passport">Pasaporte</option>
                <option value="dpi">DPI</option>
                <option value="driver_license">Licencia de Conducir</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Documento *
              </label>
              <input
                type="text"
                name="document_number"
                value={guestData.document_number}
                onChange={handleGuestChange}
                placeholder="ABC123456"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                País del Documento *
              </label>
              <input
                type="text"
                name="document_country"
                value={guestData.document_country}
                onChange={handleGuestChange}
                placeholder="GT"
                maxLength={2}
                required
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Código de 2 letras (ej: GT, MX, US)
              </p>
            </div>
          </div>
        </div>

        {/* Detalles de huéspedes */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adultos *
            </label>
            <select
              name="adults_count"
              value={reservationData.adults_count}
              onChange={handleReservationChange}
              className="select-field"
            >
              {Array.from({ length: selectedRoom.capacity }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Capacidad máxima: {selectedRoom.capacity}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niños
            </label>
            <select
              name="children_count"
              value={reservationData.children_count}
              onChange={handleReservationChange}
              className="select-field"
              disabled={reservationData.adults_count >= selectedRoom.capacity || reservationData.adults_count === 0}
            >
              {Array.from(
                { length: Math.max(0, selectedRoom.capacity - reservationData.adults_count) + 1 },
                (_, i) => i
              ).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {reservationData.adults_count >= selectedRoom.capacity
                ? 'No hay espacio para niños'
                : reservationData.adults_count === 0
                ? 'Debe haber al menos 1 adulto'
                : `Máximo ${selectedRoom.capacity - reservationData.adults_count} niño(s)`
              }
            </p>
          </div>
        </div>

        {/* Solicitudes especiales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Solicitudes Especiales
          </label>
          <textarea
            name="special_requests"
            value={reservationData.special_requests}
            onChange={handleReservationChange}
            rows={3}
            className="input-field"
            placeholder="Cama extra, vista específica, alergias, etc."
          />
        </div>

        {error && <ErrorMessage message={error} />}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={goBack}
            disabled={isLoading || successMessage}
            className="btn-secondary"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading || successMessage}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || successMessage}
            className="btn-primary"
          >
            {isLoading ? 'Creando Reserva...' : 'Crear Reserva'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewReservationForm;
