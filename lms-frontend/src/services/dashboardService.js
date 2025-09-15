import { api } from '../lib/api';

export const fetchTeacherDashboard = async () => {
  try {
    const data = await api.get('/dashboard/profesor');
    // Soporta { success, ... } o el objeto directo
    return data?.success ? data : data;
  } catch (error) {
    console.error('Error en fetchTeacherDashboard:', error);
    // Valores por defecto para no romper la UI
    return { alumnos: 0, actividades: 0, progreso: 0 };
  }
};
