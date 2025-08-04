import { API_BASE_URL } from '../config';

// 🔹 Obtener alumnos con matrícula próxima a vencer (15 días restantes)
export const fetchRenovaciones = async () => {
    const token = localStorage.getItem("token"); // ✅ Obtener token del almacenamiento

    try {
        const response = await fetch(`${API_BASE_URL}/renovaciones`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // ✅ Enviar token en el header
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error en backend: ${errorData.message || "Error desconocido"}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error en fetchRenovaciones:", error.message);
        return [];
    }
};

// 🔹 Renovar matrícula del alumno
export const renovarAlumno = async (id) => {
    const token = localStorage.getItem("token"); // ✅ Obtener token del almacenamiento

    try {
        const response = await fetch(`${API_BASE_URL}/renovaciones/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // ✅ Enviar token en el header
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error en backend: ${errorData.message || "Error desconocido"}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error en renovarAlumno:", error.message);
        return null;
    }
};
