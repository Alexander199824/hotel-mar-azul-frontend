/**
 * Validaciones - Sistema de Gestión Hotelera "Mar Azul"
 * Autor: Alexander Echeverria
 * Archivo: /src/utils/validations.js
 */

import { VALIDATION } from './constants';

// Validar email
export const validateEmail = (email) => {
  if (!email) return 'Email es requerido';
  if (!VALIDATION.EMAIL_PATTERN.test(email)) return 'Email inválido';
  return null;
};

// Validar contraseña
export const validatePassword = (password) => {
  if (!password) return 'Contraseña es requerida';
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return `Contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`;
  }
  if (!/(?=.*[a-z])/.test(password)) return 'Contraseña debe tener al menos una minúscula';
  if (!/(?=.*[A-Z])/.test(password)) return 'Contraseña debe tener al menos una mayúscula';
  if (!/(?=.*\d)/.test(password)) return 'Contraseña debe tener al menos un número';
  return null;
};

// Validar nombre
export const validateName = (name, fieldName = 'Nombre') => {
  if (!name) return `${fieldName} es requerido`;
  if (name.length < VALIDATION.NAME_MIN_LENGTH) {
    return `${fieldName} debe tener al menos ${VALIDATION.NAME_MIN_LENGTH} caracteres`;
  }
  if (name.length > VALIDATION.NAME_MAX_LENGTH) {
    return `${fieldName} no puede exceder ${VALIDATION.NAME_MAX_LENGTH} caracteres`;
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
    return `${fieldName} solo puede contener letras`;
  }
  return null;
};

// Validar teléfono
export const validatePhone = (phone) => {
  if (!phone) return 'Teléfono es requerido';
  if (!VALIDATION.PHONE_PATTERN.test(phone)) return 'Formato de teléfono inválido';
  return null;
};

// Validar fecha
export const validateDate = (date, fieldName = 'Fecha') => {
  if (!date) return `${fieldName} es requerida`;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return `${fieldName} inválida`;
  return null;
};

// Validar rango de fechas
export const validateDateRange = (startDate, endDate) => {
  const startError = validateDate(startDate, 'Fecha de inicio');
  if (startError) return startError;
  
  const endError = validateDate(endDate, 'Fecha de fin');
  if (endError) return endError;
  
  if (new Date(endDate) <= new Date(startDate)) {
    return 'Fecha de fin debe ser posterior a fecha de inicio';
  }
  
  return null;
};

// Validar capacidad de habitación
export const validateRoomCapacity = (capacity) => {
  if (!capacity) return 'Capacidad es requerida';
  const cap = parseInt(capacity);
  if (isNaN(cap) || cap < 1 || cap > 10) {
    return 'Capacidad debe ser entre 1 y 10 personas';
  }
  return null;
};

// Validar precio
export const validatePrice = (price, fieldName = 'Precio') => {
  if (!price) return `${fieldName} es requerido`;
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum < 0) {
    return `${fieldName} debe ser un número positivo`;
  }
  return null;
};

// Validar formulario de reserva
export const validateReservationForm = (formData) => {
  const errors = {};

  if (!formData.guest_id) errors.guest_id = 'Huésped es requerido';
  if (!formData.room_id) errors.room_id = 'Habitación es requerida';
  
  const dateRangeError = validateDateRange(formData.check_in_date, formData.check_out_date);
  if (dateRangeError) {
    errors.check_in_date = dateRangeError;
    errors.check_out_date = dateRangeError;
  }

  const capacityError = validateRoomCapacity(formData.adults_count);
  if (capacityError) errors.adults_count = capacityError;

  if (formData.children_count) {
    const childrenCap = parseInt(formData.children_count);
    if (isNaN(childrenCap) || childrenCap < 0 || childrenCap > 10) {
      errors.children_count = 'Número de niños debe ser entre 0 y 10';
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

// Validar formulario de huésped
export const validateGuestForm = (formData) => {
  const errors = {};

  const firstNameError = validateName(formData.first_name, 'Nombre');
  if (firstNameError) errors.first_name = firstNameError;

  const lastNameError = validateName(formData.last_name, 'Apellido');
  if (lastNameError) errors.last_name = lastNameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  if (!formData.document_number) errors.document_number = 'Número de documento es requerido';
  if (!formData.document_type) errors.document_type = 'Tipo de documento es requerido';

  if (formData.date_of_birth) {
    const birthDate = new Date(formData.date_of_birth);
    if (birthDate >= new Date()) {
      errors.date_of_birth = 'Fecha de nacimiento debe ser anterior a hoy';
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

// Validar formulario de incidencia
export const validateIncidentForm = (formData) => {
  const errors = {};

  if (!formData.title || formData.title.length < 5) {
    errors.title = 'Título debe tener al menos 5 caracteres';
  }

  if (!formData.description || formData.description.length < 10) {
    errors.description = 'Descripción debe tener al menos 10 caracteres';
  }

  if (!formData.incident_type) {
    errors.incident_type = 'Tipo de incidencia es requerido';
  }

  if (formData.estimated_cost) {
    const priceError = validatePrice(formData.estimated_cost, 'Costo estimado');
    if (priceError) errors.estimated_cost = priceError;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

// Validar formulario de login
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.credential) errors.credential = 'Email o usuario es requerido';
  if (!formData.password) errors.password = 'Contraseña es requerida';

  return Object.keys(errors).length > 0 ? errors : null;
};

// Objeto con todas las validaciones como exportación por defecto
const validations = {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateDate,
  validateDateRange,
  validateRoomCapacity,
  validatePrice,
  validateReservationForm,
  validateGuestForm,
  validateIncidentForm,
  validateLoginForm
};

export default validations;