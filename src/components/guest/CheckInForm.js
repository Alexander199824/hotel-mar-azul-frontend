/**
 * Formulario de Check-in Digital - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/guest/CheckInForm.js
 */

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { reservationService } from '../../services/reservationService';

const CheckInForm = () => {
  const [reservationCode, setReservationCode] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [reservation, setReservation] = useState(null);

  const { translate } = useLanguage();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo no puede ser mayor a 5MB');
        return;
      }
      setDocumentFile(file);
      setError('');
    }
  };

  const searchReservation = async () => {
    if (!reservationCode.trim()) {
      setError('Ingrese el código de reserva');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await reservationService.search(reservationCode);
      const reservations = response.data.reservations;
      
      if (reservations.length === 0) {
        setError('No se encontró la reserva');
        return;
      }

      const foundReservation = reservations[0];
      if (!foundReservation.can_check_in) {
        setError('Esta reserva no puede hacer check-in en este momento');
        return;
      }

      setReservation(foundReservation);
    } catch (err) {
      setError('Error al buscar la reserva: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!documentFile) {
      setError('Debe cargar un documento de identidad');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await reservationService.checkIn(reservation.id, 'Check-in digital realizado');
      setSuccess(true);
    } catch (err) {
      setError('Error al realizar check-in: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Check-in Exitoso
        </h3>
        <p className="text-gray-600 mb-4">
          Su check-in ha sido procesado. ¡Bienvenido al Hotel Mar Azul!
        </p>
        <p className="text-sm text-gray-500">
          Habitación: {reservation?.room?.room_number}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        {translate('digitalCheckin')}
      </h3>

      {!reservation ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Reserva
            </label>
            <input
              type="text"
              value={reservationCode}
              onChange={(e) => setReservationCode(e.target.value.toUpperCase())}
              placeholder="Ej: MAZ-ABC123"
              className="input-field"
              disabled={isLoading}
            />
          </div>

          {error && <ErrorMessage message={error} />}

          <button
            onClick={searchReservation}
            disabled={isLoading || !reservationCode.trim()}
            className="btn-primary w-full"
          >
            {isLoading ? <Loading size="sm" /> : 'Buscar Reserva'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Información de la Reserva
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Código: {reservation.reservation_code}</p>
              <p>Habitación: {reservation.room?.room_number}</p>
              <p>Huésped: {reservation.guest?.first_name} {reservation.guest?.last_name}</p>
              <p>Check-in: {new Date(reservation.check_in_date).toLocaleDateString()}</p>
              <p>Check-out: {new Date(reservation.check_out_date).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translate('uploadDocument')}
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="input-field"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Formatos permitidos: JPG, PNG, PDF. Máximo 5MB.
            </p>
          </div>

          {error && <ErrorMessage message={error} />}

          <div className="flex space-x-4">
            <button
              onClick={() => setReservation(null)}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Volver
            </button>
            <button
              onClick={handleCheckIn}
              disabled={isLoading || !documentFile}
              className="btn-primary flex-1"
            >
              {isLoading ? <Loading size="sm" /> : 'Confirmar Check-in'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInForm;