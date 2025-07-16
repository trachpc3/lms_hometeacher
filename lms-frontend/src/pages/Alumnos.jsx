import { useState, useEffect } from "react";
import { Pencil, Trash, PlusCircle, Search } from "lucide-react";
import { fetchAlumnos, addAlumno, updateAlumno, deleteAlumno } from "../services/alumnosService";
import AlumnoModal from "../components/AlumnoModal";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).replace(/\//g, ".");
};

const Alumnos = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [filtroCampo, setFiltroCampo] = useState("nombre");
    const [filtroTexto, setFiltroTexto] = useState("");

    useEffect(() => {
        cargarAlumnos();
    }, []);

    const cargarAlumnos = async () => {
        const data = await fetchAlumnos();
        setAlumnos(data);
    };

    const handleSave = async (alumno) => {
        if (editData) {
            await updateAlumno(editData.id, alumno);
        } else {
            await addAlumno(alumno);
        }
        setModalOpen(false);
        setEditData(null);
        cargarAlumnos();
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este alumno?")) {
            await deleteAlumno(id);
            cargarAlumnos();
        }
    };

    const alumnosFiltrados = alumnos.filter(alumno =>
        alumno[filtroCampo]?.toLowerCase().includes(filtroTexto.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-700">Mis Alumnos</h1>
                <button 
                    onClick={() => { setEditData(null); setModalOpen(true); }} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <PlusCircle size={18} /> Agregar Alumno
                </button>
            </div>

            <div className="flex gap-2 mb-4">
                <select 
                    value={filtroCampo} 
                    onChange={(e) => setFiltroCampo(e.target.value)}
                    className="border p-2 rounded-lg"
                >
                    <option value="nombre">Nombre</option>
                    <option value="email">Email</option>
                    <option value="telefono">Teléfono</option>
                </select>
                <div className="relative w-full">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={filtroTexto} 
                        onChange={(e) => setFiltroTexto(e.target.value)} 
                        className="w-full pl-10 p-2 border rounded-lg"
                    />
                </div>
            </div>

            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-3 text-left">Nombre</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Teléfono</th>
                        <th className="p-3 text-left">Fecha Registro</th>
                        <th className="p-3 text-left">Fecha Baja</th>
                        <th className="p-3 text-left">Estado</th>
                        <th className="p-3 text-left">Curso</th>
                        <th className="p-3 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnosFiltrados.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center p-3 text-gray-500">
                                No hay alumnos encontrados
                            </td>
                        </tr>
                    ) : (
                        alumnosFiltrados.map((alumno) => (
                            <tr key={alumno.id} className="border-b hover:bg-gray-100">
                                <td className="p-3">{alumno.nombre}</td>
                                <td className="p-3">{alumno.email}</td>
                                <td className="p-3">{alumno.telefono || "N/A"}</td>
                                <td className="p-3">{formatDate(alumno.fecha_registro)}</td>
                                <td className="p-3">{formatDate(alumno.fecha_baja)}</td>
                                <td className="p-3">{alumno.estado_formacion || "N/A"}</td>
                                <td className="p-3">{alumno.curso_matriculado || "N/A"}</td>
                                <td className="p-3 flex justify-center gap-3">
                                    <button onClick={() => { setEditData(alumno); setModalOpen(true); }} className="text-blue-600">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(alumno.id)} className="text-red-600">
                                        <Trash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {modalOpen && <AlumnoModal onClose={() => setModalOpen(false)} onSave={handleSave} editData={editData} />}
        </div>
    );
};

export default Alumnos;