/**
 * Componente de Mensajes de Error - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/components/common/ErrorMessage.js
 */

import React from 'react';

const ErrorMessage = ({ 
  message, 
  onRetry, 
  onDismiss, 
  type = 'error',
  title,
  showIcon = true,
  className = ''
}) => {
  const getTypeClasses = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border border-yellow-200',
          icon: 'text-yellow-400',
          title: 'text-yellow-800',
          text: 'text-yellow-700',
          button: 'text-yellow-600 hover:text-yellow-500'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border border-blue-200',
          icon: 'text-blue-400',
          title: 'text-blue-800',
          text: 'text-blue-700',
          button: 'text-blue-600 hover:text-blue-500'
        };
      case 'success':
        return {
          container: 'bg-green-50 border border-green-200',
          icon: 'text-green-400',
          title: 'text-green-800',
          text: 'text-green-700',
          button: 'text-green-600 hover:text-green-500'
        };
      default: // error
        return {
          container: 'bg-red-50 border border-red-200',
          icon: 'text-red-400',
          title: 'text-red-800',
          text: 'text-red-700',
          button: 'text-red-600 hover:text-red-500'
        };
    }
  };

  const renderIcon = () => {
    const iconClass = `h-5 w-5 ${getTypeClasses().icon}`;
    
    switch (type) {
      case 'warning':
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default: // error
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const classes = getTypeClasses();

  if (!message) return null;

  return (
    <div className={`rounded-md p-4 ${classes.container} ${className}`} role="alert">
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            {renderIcon()}
          </div>
        )}
        <div className={`${showIcon ? 'ml-3' : ''} flex-1`}>
          {title && (
            <h3 className={`text-sm font-medium ${classes.title} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${classes.text}`}>
            {typeof message === 'string' ? (
              <p>{message}</p>
            ) : Array.isArray(message) ? (
              <ul className="list-disc list-inside space-y-1">
                {message.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            ) : (
              <p>{String(message)}</p>
            )}
          </div>
          
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex space-x-3">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={`text-sm font-medium ${classes.button} underline`}
                >
                  Intentar nuevamente
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className={`text-sm font-medium ${classes.button} underline`}
                >
                  Cerrar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente simplificado para compatibilidad
export const SimpleError = ({ message, className = '' }) => (
  <div className={`text-red-600 text-sm ${className}`}>
    {message}
  </div>
);

// Componente para errores de formulario
export const FormError = ({ error, field }) => {
  if (!error) return null;
  
  const message = typeof error === 'object' && error[field] ? error[field] : error;
  
  return <SimpleError message={message} className="mt-1" />;
};

// Componente para notificaciones toast
export const ToastError = ({ message, onClose, autoClose = 5000 }) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div className="fixed top-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg border-l-4 border-red-500 p-4 z-50 animate-slide-in">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-gray-900">{message}</p>
        </div>
        {onClose && (
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;