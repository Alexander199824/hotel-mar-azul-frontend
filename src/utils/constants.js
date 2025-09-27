/**
 * Constantes del Sistema - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/utils/constants.js
 */

// Estados de habitaciones
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  CLEANING: 'cleaning',
  MAINTENANCE: 'maintenance',
  OUT_OF_ORDER: 'out_of_order',
};

// Categorías de habitaciones
export const ROOM_CATEGORIES = {
  STANDARD: 'standard',
  DELUXE: 'deluxe',
  SUITE: 'suite',
  PRESIDENTIAL: 'presidential',
};

// Estados de reservas
export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

// Estados de pago
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIAL: 'partial',
};

// Roles de usuario
export const USER_ROLES = {
  GUEST: 'guest',
  RECEPTIONIST: 'receptionist',
  CLEANING: 'cleaning',
  MANAGER: 'manager',
  ADMIN: 'admin',
};

// Tipos de incidencias
export const INCIDENT_TYPES = {
  MAINTENANCE: 'maintenance',
  CLEANING: 'cleaning',
  TECHNICAL: 'technical',
  SECURITY: 'security',
  OTHER: 'other',
};

// Prioridades de incidencias
export const INCIDENT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Estados de incidencias
export const INCIDENT_STATUS = {
  REPORTED: 'reported',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CANCELLED: 'cancelled',
};

// Tipos de servicios adicionales
export const SERVICE_TYPES = {
  RESTAURANT: 'restaurant',
  SPA: 'spa',
  TRANSPORT: 'transport',
  LAUNDRY: 'laundry',
  ROOM_SERVICE: 'room_service',
  MINIBAR: 'minibar',
  PARKING: 'parking',
  WIFI: 'wifi',
};

// Idiomas soportados
export const SUPPORTED_LANGUAGES = {
  ES: 'es',
  EN: 'en',
  FR: 'fr',
  DE: 'de',
  PT: 'pt',
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Formatos de fecha
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME_DISPLAY: 'DD/MM/YYYY HH:mm',
  DATETIME_API: 'YYYY-MM-DD HH:mm:ss',
};

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
};

// Límites de tiempo
export const TIME_LIMITS = {
  RESERVATION_TIMEOUT: 15 * 60, // 15 minutos en segundos
  SESSION_TIMEOUT: 30 * 60, // 30 minutos en segundos
  TOKEN_REFRESH_INTERVAL: 25 * 60, // 25 minutos en segundos
};

// Configuración de validaciones
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_PATTERN: /^\+?[\d\s\-\(\)]+$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifique su internet.',
  UNAUTHORIZED: 'No autorizado. Inicie sesión nuevamente.',
  FORBIDDEN: 'No tiene permisos para realizar esta acción.',
  NOT_FOUND: 'Recurso no encontrado.',
  SERVER_ERROR: 'Error del servidor. Intente nuevamente.',
  VALIDATION_ERROR: 'Datos inválidos. Verifique la información.',
  TIMEOUT_ERROR: 'Tiempo de espera agotado.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  LOGIN: 'Sesión iniciada correctamente',
  LOGOUT: 'Sesión cerrada correctamente',
  CREATED: 'Creado exitosamente',
  UPDATED: 'Actualizado exitosamente',
  DELETED: 'Eliminado exitosamente',
  RESERVATION_CREATED: 'Reserva creada exitosamente',
  RESERVATION_CONFIRMED: 'Reserva confirmada',
  CHECKIN_SUCCESS: 'Check-in realizado exitosamente',
  CHECKOUT_SUCCESS: 'Check-out realizado exitosamente',
};

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: process.env.REACT_APP_HOTEL_NAME || 'Hotel Mar Azul',
  VERSION: '1.0.0',
  CONTACT_PHONE: process.env.REACT_APP_CONTACT_PHONE || '+502 7940-0000',
  CONTACT_EMAIL: process.env.REACT_APP_CONTACT_EMAIL || 'info@hotelmarazul.com',
  DEFAULT_LANGUAGE: process.env.REACT_APP_DEFAULT_LANGUAGE || 'es',
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
};

// Configuración de colores para estados
export const STATUS_COLORS = {
  [ROOM_STATUS.AVAILABLE]: 'green',
  [ROOM_STATUS.OCCUPIED]: 'red',
  [ROOM_STATUS.CLEANING]: 'yellow',
  [ROOM_STATUS.MAINTENANCE]: 'orange',
  [ROOM_STATUS.OUT_OF_ORDER]: 'gray',
  
  [RESERVATION_STATUS.PENDING]: 'yellow',
  [RESERVATION_STATUS.CONFIRMED]: 'blue',
  [RESERVATION_STATUS.CHECKED_IN]: 'green',
  [RESERVATION_STATUS.CHECKED_OUT]: 'gray',
  [RESERVATION_STATUS.CANCELLED]: 'red',
  [RESERVATION_STATUS.NO_SHOW]: 'red',
  
  [INCIDENT_PRIORITY.LOW]: 'gray',
  [INCIDENT_PRIORITY.MEDIUM]: 'yellow',
  [INCIDENT_PRIORITY.HIGH]: 'orange',
  [INCIDENT_PRIORITY.URGENT]: 'red',
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  DURATION: 5000, // 5 segundos
  POSITION: 'top-right',
  MAX_NOTIFICATIONS: 3,
};

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  GUEST: '/guest',
  STAFF: '/staff',
  MANAGER: '/manager',
  ROOMS: '/rooms',
  RESERVATIONS: '/reservations',
  REPORTS: '/reports',
  INCIDENTS: '/incidents',
};

// Configuración de local storage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'user',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences',
};

export default {
  ROOM_STATUS,
  ROOM_CATEGORIES,
  RESERVATION_STATUS,
  PAYMENT_STATUS,
  USER_ROLES,
  INCIDENT_TYPES,
  INCIDENT_PRIORITY,
  INCIDENT_STATUS,
  SERVICE_TYPES,
  SUPPORTED_LANGUAGES,
  PAGINATION,
  DATE_FORMATS,
  FILE_CONFIG,
  TIME_LIMITS,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  APP_CONFIG,
  STATUS_COLORS,
  NOTIFICATION_CONFIG,
  ROUTES,
  STORAGE_KEYS,
};