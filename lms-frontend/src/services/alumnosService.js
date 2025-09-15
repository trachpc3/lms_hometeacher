import { api } from '../lib/api';

/**
 * Obtiene alumnos con filtros opcionales.
 * @param {Object} params - e.g. { q, page, estado }
 */
export async function fetchAlumnos(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();

  const data = await api.get(`/alumnos${qs ? `?${qs}` : ''}`);
  // Soporta backend que devuelve { success, alumnos: [...] } o directamente [...]
  return Array.isArray(data?.alumnos) ? data.alumnos : Array.isArray(data) ? data : [];
}

export async function addAlumno(alumno) {
  // alumno: { nombre, email, telefono, ... }
  const data = await api.post('/alumnos', alumno);
  return data;
}

export async function updateAlumno(id, alumno) {
  const data = await api.put(`/alumnos/${id}`, alumno);
  return data;
}

export async function deleteAlumno(id) {
  const data = await api.del(`/alumnos/${id}`);
  return data; // si prefieres booleano: return true;
}
