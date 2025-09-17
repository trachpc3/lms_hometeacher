// services/alumnosService.js
import { api } from '../lib/api';

/**
 * Obtiene alumnos con filtros y paginación.
 * @param {Object} params - e.g. { q, estado, estado_formacion, mine, page, limit }
 * @returns {Object} - { alumnos, total, page, pages }
 */
export async function fetchAlumnos(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ''
    )
  ).toString();

  const res = await api.get(`/alumnos${qs ? `?${qs}` : ''}`);

  // Manejar nueva estructura con paginación
  if (res && typeof res === 'object' && Array.isArray(res.alumnos)) {
    return {
      alumnos: res.alumnos,
      total: res.total ?? res.alumnos.length,
      page: res.page ?? 1,
      pages: res.pages ?? 1,
    };
  }

  // Compatibilidad con respuesta antigua (array plano)
  if (Array.isArray(res)) {
    return {
      alumnos: res,
      total: res.length,
      page: 1,
      pages: 1,
    };
  }

  // Fallback seguro
  return {
    alumnos: [],
    total: 0,
    page: 1,
    pages: 1,
  };
}

/**
 * Crea un nuevo alumno
 * @param {Object} alumno - { nombre, apellidos, email, telefono, ... }
 */
export async function addAlumno(alumno) {
  return await api.post('/alumnos', alumno);
}

/**
 * Actualiza un alumno existente
 * @param {number|string} id
 * @param {Object} alumno
 */
export async function updateAlumno(id, alumno) {
  return await api.put(`/alumnos/${id}`, alumno);
}

/**
 * Elimina (soft delete) un alumno
 * @param {number|string} id
 */
export async function deleteAlumno(id) {
  return await api.del(`/alumnos/${id}`);
}

/**
 * Obtiene contadores globales de alumnos.
 * @returns {Object} - { totalAlumnos, misAlumnos }
 */
export async function fetchContadoresAlumnos() {
  return await api.get('/alumnos/stats');
}

