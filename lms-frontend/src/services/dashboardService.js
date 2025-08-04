import { API_BASE_URL } from '../config';

export const fetchTeacherDashboard = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/profesor`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener datos del dashboard");

        return await response.json();
    } catch (error) {
        console.error("Error en fetchTeacherDashboard:", error);
        return { alumnos: 0, actividades: 0, progreso: 0 }; // Valores por defecto
    }
};
