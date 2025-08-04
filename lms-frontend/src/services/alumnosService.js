import { API_BASE_URL } from '../config';

export const fetchAlumnos = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/alumnos`);
        if (!response.ok) throw new Error("Error al obtener los alumnos");
        return await response.json();
    } catch (error) {
        console.error("Error en fetchAlumnos:", error);
        throw error;
    }
};

export const addAlumno = async (alumno) => {
    try {
        const response = await fetch(`${API_BASE_URL}/alumnos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alumno),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al agregar alumno");
        return data;
    } catch (error) {
        console.error("Error en addAlumno:", error);
        throw error;
    }
};

export const updateAlumno = async (id, alumno) => {
    try {
        const response = await fetch(`${API_BASE_URL}/alumnos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alumno),
        });

        const data = await response.json();
        console.log("📥 Respuesta del backend:", data); // 🔍 Verifica qué responde el backend

        if (!response.ok) throw new Error(data.message || "Error al actualizar alumno");

        return data;
    } catch (error) {
        console.error("Error en updateAlumno:", error);
        throw error;
    }
};


export const deleteAlumno = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/alumnos/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error al eliminar alumno");
        }
    } catch (error) {
        console.error("Error en deleteAlumno:", error);
        throw error;
    }
};
