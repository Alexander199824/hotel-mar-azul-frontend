/**
 * Componente Footer - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/common/Footer.js
 */

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { translate } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Información del Hotel */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {process.env.REACT_APP_HOTEL_NAME}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Sistema de gestión hotelera integral para brindar 
              la mejor experiencia a nuestros huéspedes.
            </p>
            <div className="text-sm text-gray-300">
              <p>{process.env.REACT_APP_HOTEL_ADDRESS}</p>
            </div>
          </div>
          
          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{process.env.REACT_APP_CONTACT_PHONE}</span>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{process.env.REACT_APP_CONTACT_EMAIL}</span>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Recepción 24/7</span>
              </div>
            </div>
          </div>
          
          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <div className="space-y-2 text-sm">
              <a href="/" className="text-gray-300 hover:text-white block transition-colors">
                {translate('home')}
              </a>
              <a href="/login" className="text-gray-300 hover:text-white block transition-colors">
                Acceso Personal
              </a>
              {process.env.REACT_APP_TERMS_URL && (
                <a 
                  href={process.env.REACT_APP_TERMS_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white block transition-colors"
                >
                  Términos y Condiciones
                </a>
              )}
              {process.env.REACT_APP_PRIVACY_URL && (
                <a 
                  href={process.env.REACT_APP_PRIVACY_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white block transition-colors"
                >
                  Política de Privacidad
                </a>
              )}
            </div>
          </div>
          
          {/* Redes Sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              {process.env.REACT_APP_FACEBOOK_URL && (
                <a
                  href={process.env.REACT_APP_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              
              {process.env.REACT_APP_INSTAGRAM_URL && (
                <a
                  href={process.env.REACT_APP_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.73-3.016-1.8L7.6 14.01c.351.665.993 1.115 1.75 1.115.993 0 1.8-.806 1.8-1.8s-.807-1.8-1.8-1.8c-.757 0-1.399.45-1.75 1.115L5.433 10.46c.568-1.07 1.719-1.8 3.016-1.8 1.914 0 3.464 1.55 3.464 3.464-.001 1.915-1.551 3.464-3.464 3.464z"/>
                  </svg>
                </a>
              )}
              
              {process.env.REACT_APP_TWITTER_URL && (
                <a
                  href={process.env.REACT_APP_TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
            </div>
            
            {/* Información adicional */}
            <div className="mt-4 text-xs text-gray-400">
              <p>Sistema desarrollado por</p>
              <p className="font-medium">Alexander Echeverria</p>
            </div>
          </div>
        </div>
        
        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              <p>&copy; {currentYear} {process.env.REACT_APP_HOTEL_NAME}. Todos los derechos reservados.</p>
            </div>
            
            <div className="text-xs text-gray-500 mt-2 md:mt-0">
              <p>Versión {process.env.REACT_APP_VERSION} | Entorno: {process.env.REACT_APP_ENVIRONMENT}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;