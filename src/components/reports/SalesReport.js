/**
 * Reporte de Ventas - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/reports/SalesReport.js
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { reportService } from '../../services/reportService';
import { formatDate, formatCurrency } from '../../utils/helpers';

const SalesReport = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    include_services: true,
    service_type: ''
  });

  const { translate } = useLanguage();

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateReport = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await reportService.generateSalesReport(
        filters.start_date,
        filters.end_date,
        {
          include_services: filters.include_services,
          service_type: filters.service_type || undefined
        }
      );
      setReportData(response.data);
    } catch (err) {
      setError('Error al generar reporte: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, []);

  const exportReport = (format) => {
    if (!reportData) return;
    
    const filename = `reporte_ventas_${filters.start_date}_${filters.end_date}.${format}`;
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {translate('salesReport')}
        </h3>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
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
              Fecha Fin
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
              Tipo de Servicio
            </label>
            <select
              name="service_type"
              value={filters.service_type}
              onChange={handleFilterChange}
              className="select-field"
            >
              <option value="">Todos</option>
              <option value="restaurant">Restaurante</option>
              <option value="spa">Spa</option>
              <option value="transport">Transporte</option>
              <option value="room_service">Servicio a Cuarto</option>
              <option value="minibar">Minibar</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="include_services"
                checked={filters.include_services}
                onChange={handleFilterChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Incluir Servicios</span>
            </label>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={generateReport}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? <Loading size="sm" /> : translate('generateReport')}
          </button>

          {reportData && (
            <div className="flex space-x-2">
              <button
                onClick={() => exportReport('json')}
                className="btn-outline"
              >
                Exportar JSON
              </button>
              <button
                onClick={() => exportReport('csv')}
                className="btn-outline"
              >
                Exportar CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {reportData && (
        <div className="space-y-6">
          {/* Resumen */}
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Resumen de Ventas</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(reportData.summary?.total_revenue || 0)}
                </div>
                <div className="text-sm text-gray-600">Ingresos Totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(reportData.summary?.room_revenue || 0)}
                </div>
                <div className="text-sm text-gray-600">Ingresos Habitaciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(reportData.summary?.services_revenue || 0)}
                </div>
                <div className="text-sm text-gray-600">Ingresos Servicios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(reportData.summary?.average_transaction || 0)}
                </div>
                <div className="text-sm text-gray-600">Ticket Promedio</div>
              </div>
            </div>
          </div>

          {/* Ventas por Servicio */}
          {reportData.services_breakdown && (
            <div className="bg-white shadow rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Ventas por Servicio</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="table-header">Servicio</th>
                      <th className="table-header">Transacciones</th>
                      <th className="table-header">Ingresos</th>
                      <th className="table-header">Promedio</th>
                      <th className="table-header">% del Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.services_breakdown.map((service, index) => (
                      <tr key={index}>
                        <td className="table-cell font-medium capitalize">
                          {service.service_type}
                        </td>
                        <td className="table-cell">{service.transaction_count}</td>
                        <td className="table-cell">{formatCurrency(service.total_revenue)}</td>
                        <td className="table-cell">{formatCurrency(service.average_amount)}</td>
                        <td className="table-cell">{service.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tendencias Diarias */}
          {reportData.daily_revenue && (
            <div className="bg-white shadow rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Tendencias Diarias</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="table-header">Fecha</th>
                      <th className="table-header">Ingresos Totales</th>
                      <th className="table-header">Habitaciones</th>
                      <th className="table-header">Servicios</th>
                      <th className="table-header">Transacciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.daily_revenue.slice(-10).map((day, index) => (
                      <tr key={index}>
                        <td className="table-cell">{formatDate(day.date)}</td>
                        <td className="table-cell font-medium">
                          {formatCurrency(day.total_revenue)}
                        </td>
                        <td className="table-cell">{formatCurrency(day.room_revenue)}</td>
                        <td className="table-cell">{formatCurrency(day.services_revenue)}</td>
                        <td className="table-cell">{day.transaction_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Reservas */}
          {reportData.top_reservations && (
            <div className="bg-white shadow rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Reservas de Mayor Valor</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="table-header">Código</th>
                      <th className="table-header">Huésped</th>
                      <th className="table-header">Habitación</th>
                      <th className="table-header">Total</th>
                      <th className="table-header">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.top_reservations.map((reservation, index) => (
                      <tr key={index}>
                        <td className="table-cell font-medium">
                          {reservation.reservation_code}
                        </td>
                        <td className="table-cell">{reservation.guest_name}</td>
                        <td className="table-cell">{reservation.room_number}</td>
                        <td className="table-cell font-medium">
                          {formatCurrency(reservation.total_amount)}
                        </td>
                        <td className="table-cell">{formatDate(reservation.check_in_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesReport;