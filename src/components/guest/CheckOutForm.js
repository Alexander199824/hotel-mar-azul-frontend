/**
 * Formulario de Check-out Digital - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/guest/CheckOutForm.js
 */

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { reservationService } from '../../services/reservationService';

const CheckOutForm = () => {
  const [reservationCode, setReservationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [invoice, setInvoice] = useState(null);

  const { translate } = useLanguage();

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
      if (!foundReservation.can_check_out) {
        setError('Esta reserva no puede hacer check-out en este momento');
        return;
      }

      setReservation(foundReservation);
    } catch (err) {
      setError('Error al buscar la reserva: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await reservationService.checkOut(reservation.id, 'Check-out digital realizado', true);
      setInvoice(response.data.invoice);
      setSuccess(true);
    } catch (err) {
      setError('Error al realizar check-out: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-8">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Check-out Exitoso
        </h3>
        
        <p className="text-gray-600 mb-6">
          Gracias por hospedarse en Hotel Mar Azul. Esperamos verle pronto.
        </p>

        {invoice && (
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h4 className="font-medium text-gray-900 mb-3">Resumen de Facturación</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Habitación:</span>
                <span>{reservation?.room?.room_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Noches:</span>
                <span>{reservation?.nights_count}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Q{reservation?.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos:</span>
                <span>Q{reservation?.tax_amount}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
                <span>Total:</span>
                <span>Q{reservation?.total_amount}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-3">
              La factura ha sido enviada a su correo electrónico.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        {translate('digitalCheckout')}
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

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Resumen de Cargos</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div className="flex justify-between">
                <span>Hospedaje ({reservation.nights_count} noches):</span>
                <span>Q{reservation.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos:</span>
                <span>Q{reservation.tax_amount}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-blue-200">
                <span>Total:</span>
                <span>Q{reservation.total_amount}</span>
              </div>
            </div>
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
              onClick={handleCheckOut}
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? <Loading size="sm" /> : 'Confirmar Check-out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOutForm;