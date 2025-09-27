/**
 * Reporte de Ocupación - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/reports/OccupancyReport.js
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { reportService } from '../../services/reportService';
import { formatDate, formatPercentage } from '../../utils/helpers';

const OccupancyReport = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    category: '',
    status: ''
  });

  const { translate } = useLanguage();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await reportService.generateOccupancyReport(
        filters.start_date,
        filters.end_date,
        {
          category: filters.category || undefined,
          status: filters.status || undefined
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
    
    const filename = `reporte_ocupacion_${filters.start_date}_${filters.end_date}.${format}`;
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
          {translate('occupancyReport')}
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
              <option value="confirmed">Confirmado</option>
              <option value="checked_in">Check-in</option>
              <option value="checked_out">Check-out</option>
            </select>
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
            <h4 className="text-lg font-medium text-gray-900 mb-4">Resumen de Ocupación</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatPercentage(reportData.summary?.occupancy_rate || 0)}
                </div>
                <div className="text-sm text-gray-600">Tasa de Ocupación</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reportData.summary?.total_reservations || 0}
                </div>
                <div className="text-sm text-gray-600">Total Reservas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {reportData.summary?.total_nights || 0}
                </div>
                <div className="text-sm text-gray-600">Noches Vendidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  Q{reportData.summary?.average_daily_rate || 0}
                </div>
                <div className="text-sm text-gray-600">Tarifa Promedio</div>
              </div>
            </div>
          </div>

          {/* Estadísticas por Categoría */}
          {reportData.category_statistics && (
            <div className="bg-white shadow rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Por Categoría</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="table-header">Categoría</th>
                      <th className="table-header">Habitaciones</th>
                      <th className="table-header">Ocupación</th>
                      <th className="table-header">Tarifa Promedio</th>
                      <th className="table-header">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.category_statistics.map((category, index) => (
                      <tr key={index}>
                        <td className="table-cell font-medium capitalize">
                          {category.category}
                        </td>
                        <td className="table-cell">{category.total_rooms}</td>
                        <td className="table-cell">
                          {formatPercentage(category.occupancy_rate)}
                        </td>
                        <td className="table-cell">Q{category.average_rate}</td>
                        <td className="table-cell">Q{category.total_revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tendencias Diarias */}
          {reportData.daily_statistics && (
            <div className="bg-white shadow rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Tendencias Diarias</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="table-header">Fecha</th>
                      <th className="table-header">Ocupación</th>
                      <th className="table-header">Reservas</th>
                      <th className="table-header">Check-ins</th>
                      <th className="table-header">Check-outs</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.daily_statistics.slice(-10).map((day, index) => (
                      <tr key={index}>
                        <td className="table-cell">{formatDate(day.date)}</td>
                        <td className="table-cell">
                          {formatPercentage(day.occupancy_rate)}
                        </td>
                        <td className="table-cell">{day.total_reservations}</td>
                        <td className="table-cell">{day.checkins}</td>
                        <td className="table-cell">{day.checkouts}</td>
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

export default OccupancyReport;