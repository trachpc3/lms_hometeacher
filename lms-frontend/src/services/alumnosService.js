// services/alumnosService.js
import { api } from '../lib/api';

/**
 * Obtiene alumnos con filtros opcionales.
 * @param {Object} params - e.g. { q, page, estado, mine }
 */
export async function fetchAlumnos(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ''
    )
  ).toString();

  const res = await api.get(`/alumnos${qs ? `?${qs}` : ''}`);

  // Backend puede devolver directamente un array o un objeto con { alumnos: [...] }
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.alumnos)) return res.alumnos;

  return [];
}

export async function addAlumno(alumno) {
  // alumno: { nombre, apellidos, email, telefono, ... }
  return await api.post('/alumnos', alumno);
}

export async function updateAlumno(id, alumno) {
  return await api.put(`/alumnos/${id}`, alumno);
}

export async function deleteAlumno(id) {
  return await api.del(`/alumnos/${id}`);
}
