/**
 * Safe Storage Utility - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/utils/safeStorage.js
 *
 * Proporciona acceso seguro a localStorage con verificaciones de entorno
 * para evitar errores durante el proceso de build de webpack
 */

/**
 * Verifica si estamos en un entorno de navegador
 * @returns {boolean} true si window y localStorage están disponibles
 */
const isBrowser = () => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

/**
 * Safe localStorage wrapper que verifica el entorno antes de acceder
 */
export const safeStorage = {
  /**
   * Obtiene un item de localStorage de forma segura
   * @param {string} key - La clave del item
   * @returns {string|null} El valor almacenado o null
   */
  getItem: (key) => {
    if (!isBrowser()) {
      console.warn(`safeStorage.getItem: localStorage no disponible durante build (key: ${key})`);
      return null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error(`Error al obtener item de localStorage (${key}):`, error);
      return null;
    }
  },

  /**
   * Guarda un item en localStorage de forma segura
   * @param {string} key - La clave del item
   * @param {string} value - El valor a guardar
   * @returns {boolean} true si se guardó exitosamente
   */
  setItem: (key, value) => {
    if (!isBrowser()) {
      console.warn(`safeStorage.setItem: localStorage no disponible durante build (key: ${key})`);
      return false;
    }
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error al guardar item en localStorage (${key}):`, error);
      return false;
    }
  },

  /**
   * Elimina un item de localStorage de forma segura
   * @param {string} key - La clave del item a eliminar
   * @returns {boolean} true si se eliminó exitosamente
   */
  removeItem: (key) => {
    if (!isBrowser()) {
      console.warn(`safeStorage.removeItem: localStorage no disponible durante build (key: ${key})`);
      return false;
    }
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error al eliminar item de localStorage (${key}):`, error);
      return false;
    }
  },

  /**
   * Limpia todo el localStorage de forma segura
   * @returns {boolean} true si se limpió exitosamente
   */
  clear: () => {
    if (!isBrowser()) {
      console.warn('safeStorage.clear: localStorage no disponible durante build');
      return false;
    }
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
      return false;
    }
  },

  /**
   * Verifica si localStorage está disponible
   * @returns {boolean} true si está disponible
   */
  isAvailable: () => {
    return isBrowser();
  }
};

export default safeStorage;
