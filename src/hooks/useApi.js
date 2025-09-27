/**
 * Hook useApi - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/hooks/useApi.js
 */

import { useState, useEffect } from 'react';
import { apiMethods, handleApiError } from '../services/api';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    method = 'GET',
    params = {},
    body = null,
    immediate = true,
    onSuccess,
    onError
  } = options;

  const execute = async (overrideOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const requestOptions = {
        ...options,
        ...overrideOptions
      };

      let response;
      
      switch (requestOptions.method || method) {
        case 'GET':
          response = await apiMethods.get(url, { params: requestOptions.params || params });
          break;
        case 'POST':
          response = await apiMethods.post(url, requestOptions.body || body);
          break;
        case 'PUT':
          response = await apiMethods.put(url, requestOptions.body || body);
          break;
        case 'PATCH':
          response = await apiMethods.patch(url, requestOptions.body || body);
          break;
        case 'DELETE':
          response = await apiMethods.delete(url);
          break;
        default:
          throw new Error(`Método HTTP no soportado: ${method}`);
      }

      setData(response.data);
      
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && url) {
      execute();
    }
  }, [url, immediate]);

  const refetch = () => execute();

  return {
    data,
    loading,
    error,
    execute,
    refetch
  };
};

export const useLazyApi = (url, options = {}) => {
  return useApi(url, { ...options, immediate: false });
};

export default useApi;