/**
 * Reporte de Incidencias - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/staff/IncidentReport.js
 */

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { validateIncidentForm } from '../../utils/validations';
import { getStatusColor } from '../../utils/helpers';

const IncidentReport = ({ onSubmit, room }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incident_type: 'maintenance',
    priority: 'medium',
    room_id: room?.id || '',
    location: '',
    affects_guest_experience: false,
    affects_safety: false,
    affects_operations: false,
    estimated_cost: '',
    before_photos: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { translate } = useLanguage();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      before_photos: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateIncidentForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-600 bg-gray-100',
      medium: 'text-yellow-700 bg-yellow-100',
      high: 'text-orange-700 bg-orange-100',
      urgent: 'text-red-700 bg-red-100'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {translate('reportIncident')}
        </h3>

        {room && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Habitación Seleccionada</h4>
            <div className="text-sm text-blue-800">
              <p>Número: {room.room_number}</p>
              <p>Categoría: {room.category}</p>
              <p>Piso: {room.floor}</p>
              <p className="capitalize">Estado: {room.status}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la Incidencia *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: Aire acondicionado no funciona"
              required
            />
            {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Detallada *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="textarea-field"
              placeholder="Describe el problema en detalle..."
              required
            />
            {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Incidencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Incidencia *
              </label>
              <select
                name="incident_type"
                value={formData.incident_type}
                onChange={handleChange}
                className="select-field"
                required
              >
                <option value="maintenance">Mantenimiento</option>
                <option value="cleaning">Limpieza</option>
                <option value="technical">Técnico</option>
                <option value="security">Seguridad</option>
                <option value="other">Otro</option>
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="select-field"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
              <div className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(formData.priority)}`}>
                  {formData.priority === 'low' && 'Baja'}
                  {formData.priority === 'medium' && 'Media'}
                  {formData.priority === 'high' && 'Alta'}
                  {formData.priority === 'urgent' && 'Urgente'}
                </span>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación Específica
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: Baño, balcón, entrada..."
            />
          </div>

          {/* Costo Estimado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo Estimado (Q)
            </label>
            <input
              type="number"
              name="estimated_cost"
              value={formData.estimated_cost}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="input-field"
              placeholder="0.00"
            />
            {errors.estimated_cost && <div className="text-red-600 text-sm mt-1">{errors.estimated_cost}</div>}
          </div>

          {/* Impactos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Impactos
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="affects_guest_experience"
                  checked={formData.affects_guest_experience}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm"
                />
                <span className="ml-2 text-sm text-gray-700">Afecta experiencia del huésped</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="affects_safety"
                  checked={formData.affects_safety}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-red-600 shadow-sm"
                />
                <span className="ml-2 text-sm text-gray-700">Afecta seguridad</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="affects_operations"
                  checked={formData.affects_operations}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-orange-600 shadow-sm"
                />
                <span className="ml-2 text-sm text-gray-700">Afecta operaciones</span>
              </label>
            </div>
          </div>

          {/* Fotos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotos del Problema
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes subir múltiples fotos. Formatos: JPG, PNG. Máximo 5MB por archivo.
            </p>
          </div>

          {/* Errores de envío */}
          {errors.submit && <ErrorMessage message={errors.submit} />}

          {/* Botones */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? <Loading size="sm" /> : 'Reportar Incidencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentReport;