/**
 * Página de Login - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/pages/LoginPage.js
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    credential: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const { translate } = useLanguage();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getDashboardRoute(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const getDashboardRoute = (role) => {
    switch (role) {
      case 'guest':
        return '/guest';
      case 'manager':
        return '/manager';
      case 'receptionist':
      case 'cleaning':
        return '/staff';
      default:
        return '/';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        // La redirección se manejará en el useEffect
      } else {
        setError(result.message || translate('loginFailed'));
      }
    } catch (err) {
      setError(err.message || translate('loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.credential.trim() && formData.password.trim();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {translate('login')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {process.env.REACT_APP_HOTEL_NAME}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="credential" className="block text-sm font-medium text-gray-700">
                {translate('email')} / Usuario
              </label>
              <input
                id="credential"
                name="credential"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese su email o usuario"
                value={formData.credential}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {translate('password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Ingrese su contraseña"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <ErrorMessage message={error} />
          )}

          <div>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loading size="sm" />
              ) : (
                translate('loginButton')
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500"
              onClick={() => {
                // TODO: Implementar recuperación de contraseña
                alert('Funcionalidad de recuperación de contraseña próximamente');
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>

        {/* Información de prueba */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Cuentas de prueba:
          </h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Admin:</strong> admin / Admin123!</p>
            <p><strong>Manager:</strong> maria.gonzalez / Admin123!</p>
            <p><strong>Recepcionista:</strong> carlos.perez / Admin123!</p>
            <p><strong>Limpieza:</strong> ana.lopez / Admin123!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;