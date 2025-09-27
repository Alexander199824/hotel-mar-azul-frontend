/**
 * Formulario de Login - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/auth/LoginForm.js
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    credential: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { translate } = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(result.message || translate('loginFailed'));
      }
    } catch (err) {
      setError(err.message || translate('loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {translate('email')} / Usuario
        </label>
        <input
          type="text"
          name="credential"
          value={formData.credential}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="Ingrese su email o usuario"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {translate('password')}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="Ingrese su contraseña"
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading || !formData.credential || !formData.password}
        className="btn-primary w-full"
      >
        {isLoading ? 'Ingresando...' : translate('loginButton')}
      </button>
    </form>
  );
};

export default LoginForm;