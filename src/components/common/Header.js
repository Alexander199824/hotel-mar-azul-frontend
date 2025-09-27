/**
 * Componente Header - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/common/Header.js
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, changeLanguage, translate, supportedLanguages } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
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

  return (
    <header className="bg-blue-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre del hotel */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-300 rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">H</span>
            </div>
            <span className="text-white font-bold text-xl">
              {process.env.REACT_APP_HOTEL_NAME}
            </span>
          </Link>

          {/* Navegación principal */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-blue-200 transition-colors"
            >
              {translate('home')}
            </Link>
            
            {isAuthenticated && (
              <Link 
                to={getDashboardRoute()} 
                className="text-white hover:text-blue-200 transition-colors"
              >
                {translate('dashboard')}
              </Link>
            )}
          </nav>

          {/* Controles del usuario */}
          <div className="flex items-center space-x-4">
            {/* Selector de idioma */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-blue-800 text-white border-blue-700 rounded px-2 py-1 text-sm"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Menú de usuario */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
                >
                  <span className="text-sm">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <svg 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                        <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                      </div>
                      <Link
                        to={getDashboardRoute()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {translate('dashboard')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {translate('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {translate('login')}
              </Link>
            )}

            {/* Botón de menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-blue-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-blue-800">
            <Link 
              to="/" 
              className="block px-4 py-2 text-white hover:text-blue-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {translate('home')}
            </Link>
            {isAuthenticated && (
              <Link 
                to={getDashboardRoute()} 
                className="block px-4 py-2 text-white hover:text-blue-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {translate('dashboard')}
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;