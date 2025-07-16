import { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import { fetchRenovaciones, renovarAlumno } from "../services/renovacionesService";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).replace(/\//g, ".");
};

const Renovaciones = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [filtroTexto, setFiltroTexto] = useState("");

    useEffect(() => {
        cargarRenovaciones();
    }, []);

    const cargarRenovaciones = async () => {
        const data = await fetchRenovaciones();
        setAlumnos(data);
    };

    const handleRenovar = async (id) => {
        if (window.confirm("¿Deseas renovar la matrícula de este alumno?")) {
            await renovarAlumno(id);
            cargarRenovaciones();
        }
    };

    const alumnosFiltrados = alumnos.filter(alumno =>
        alumno.nombre.toLowerCase().includes(filtroTexto.toLowerCase())
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-700 mb-6">Renovaciones</h1>

            {/* 🔍 Buscador */}
            <div className="relative w-full mb-4">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre..." 
                    value={filtroTexto} 
                    onChange={(e) => setFiltroTexto(e.target.value)} 
                    className="w-full pl-10 p-2 border rounded-lg"
                />
            </div>

            {/* 📋 Tabla de renovaciones */}
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-3 text-left">Nombre</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Teléfono</th>
                        <th className="p-3 text-left">Fecha Fin Matrícula</th>
                        <th className="p-3 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnosFiltrados.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center p-3 text-gray-500">
                                No hay alumnos próximos a finalizar su matrícula
                            </td>
                        </tr>
                    ) : (
                        alumnosFiltrados.map((alumno) => (
                            <tr key={alumno.id} className="border-b hover:bg-gray-100">
                                <td className="p-3">{alumno.nombre}</td>
                                <td className="p-3">{alumno.email}</td>
                                <td className="p-3">{alumno.telefono || "N/A"}</td>
                                <td className="p-3">{alumno.fecha_baja ? formatDate(alumno.fecha_baja) : "Sin fecha"}</td>

                                <td className="p-3 flex justify-center">
                                    <button onClick={() => handleRenovar(alumno.id)} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600">
                                        <RefreshCw size={18} /> Renovar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Renovaciones;