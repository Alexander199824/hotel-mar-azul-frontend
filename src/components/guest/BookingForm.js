/**
 * Formulario de Reservas - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/guest/BookingForm.js
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { roomService } from '../../services/roomService';
import { reservationService } from '../../services/reservationService';

const BookingForm = () => {
  const { translate } = useLanguage();
  const [step, setStep] = useState(1); // 1: búsqueda, 2: selección, 3: confirmación
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos en segundos

  // Timer para completar reserva
  useEffect(() => {
    let timer;
    if (step === 3 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

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
    setReservationData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const searchRooms = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await roomService.searchAvailable(searchData);
      setAvailableRooms(response.data.rooms);
      setStep(2);
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
    setTimeLeft(900); // Reiniciar timer
  };

  const confirmReservation = async () => {
    setError('');
    setIsLoading(true);

    try {
      const reservationPayload = {
        room_id: selectedRoom.id,
        check_in_date: searchData.check_in_date,
        check_out_date: searchData.check_out_date,
        adults_count: reservationData.adults_count,
        children_count: reservationData.children_count,
        special_requests: reservationData.special_requests,
      };

      const response = await reservationService.create(reservationPayload);
      
      // Mostrar confirmación exitosa
      alert(`Reserva confirmada! Código: ${response.data.reservation.reservation_code}`);
      
      // Resetear formulario
      setStep(1);
      setSelectedRoom(null);
      setSearchData({
        check_in_date: '',
        check_out_date: '',
        capacity: 2,
      });
      setReservationData({
        adults_count: 2,
        children_count: 0,
        special_requests: '',
      });
    } catch (err) {
      setError('Error al confirmar reserva: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Paso 1: Búsqueda de habitaciones
  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {translate('searchRooms')}
        </h3>

        <form onSubmit={searchRooms} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translate('checkIn')}
              </label>
              <input
                type="date"
                name="check_in_date"
                value={searchData.check_in_date}
                onChange={handleSearchChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translate('checkOut')}
              </label>
              <input
                type="date"
                name="check_out_date"
                value={searchData.check_out_date}
                onChange={handleSearchChange}
                min={searchData.check_in_date || new Date().toISOString().split('T')[0]}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Huéspedes
            </label>
            <select
              name="capacity"
              value={searchData.capacity}
              onChange={handleSearchChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Huésped' : 'Huéspedes'}
                </option>
              ))}
            </select>
          </div>

          {error && <ErrorMessage message={error} />}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loading size="sm" /> : translate('searchRooms')}
          </button>
        </form>
      </div>
    );
  }

  // Paso 2: Selección de habitación
  if (step === 2) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Habitaciones Disponibles
          </h3>
          <button
            onClick={() => setStep(1)}
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            Modificar Búsqueda
          </button>
        </div>

        {availableRooms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron habitaciones disponibles.</p>
            <button
              onClick={() => setStep(1)}
              className="mt-4 text-blue-600 hover:text-blue-500"
            >
              Intentar con otras fechas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableRooms.map((room) => (
              <div key={room.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      Habitación {room.room_number}
                    </h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {room.category} - Piso {room.floor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      Q{room.pricing?.totalPrice || room.base_price}
                    </p>
                    <p className="text-xs text-gray-500">
                      {room.pricing?.nights || 1} noche(s)
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Capacidad: {room.capacity} huéspedes
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Camas: {room.beds_count} ({room.bed_type})
                  </p>
                  {room.has_ocean_view && (
                    <p className="text-sm text-green-600">Vista al mar</p>
                  )}
                </div>

                <button
                  onClick={() => selectRoom(room)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Seleccionar Habitación
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Paso 3: Confirmación de reserva
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {translate('confirmReservation')}
        </h3>
        <div className="text-red-600 font-medium">
          Tiempo restante: {formatTime(timeLeft)}
        </div>
      </div>

      {timeLeft <= 0 ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            El tiempo para completar la reserva ha expirado.
          </p>
          <button
            onClick={() => setStep(1)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Comenzar Nueva Búsqueda
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Resumen de la habitación */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Habitación {selectedRoom?.room_number}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>Categoría: {selectedRoom?.category}</div>
              <div>Piso: {selectedRoom?.floor}</div>
              <div>Check-in: {searchData.check_in_date}</div>
              <div>Check-out: {searchData.check_out_date}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>Q{selectedRoom?.pricing?.totalPrice || selectedRoom?.base_price}</span>
              </div>
            </div>
          </div>

          {/* Detalles de huéspedes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adultos
              </label>
              <select
                name="adults_count"
                value={reservationData.adults_count}
                onChange={handleReservationChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niños
              </label>
              <select
                name="children_count"
                value={reservationData.children_count}
                onChange={handleReservationChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {[0, 1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solicitudes Especiales
            </label>
            <textarea
              name="special_requests"
              value={reservationData.special_requests}
              onChange={handleReservationChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Cama extra, vista específica, etc."
            />
          </div>

          {error && <ErrorMessage message={error} />}

          <div className="flex space-x-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Volver
            </button>
            <button
              onClick={confirmReservation}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? <Loading size="sm" /> : 'Confirmar Reserva'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;