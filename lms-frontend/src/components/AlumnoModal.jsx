import { useState, useEffect } from "react";
import { addAlumno, updateAlumno } from "../services/alumnosService";

const AlumnoModal = ({ onClose, onSave, editData }) => {
    const [alumno, setAlumno] = useState({
        nombre: "",
        apellidos: "",
        telefono: "",
        email: "",
        password: "hometeacher",
        curso: "B1",
        profesor: "1",
        observaciones: "",
        estado_formacion: "demo",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editData) {
            setAlumno({
                nombre: editData.nombre || "",
                apellidos: editData.apellidos || "",
                telefono: editData.telefono || "",
                email: editData.email || "",
                password: editData.password || "hometeacher",
                curso: editData.curso || "B1",
                profesor: editData.profesor || "1",
                observaciones: editData.observaciones || "",
                estado_formacion: editData.estado_formacion || "demo",
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        setAlumno({ ...alumno, [e.target.name]: e.target.value });
    };

    const handleGeneratePassword = () => {
        const nombreParte = alumno.nombre.slice(0, 4).toLowerCase();
        const apellidoParte = alumno.apellidos.slice(0, 4).toLowerCase();
        setAlumno({ ...alumno, password: (nombreParte + apellidoParte).padEnd(8, "x") });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // ✅ Evitar doble ejecución

        setLoading(true);
        setError(null);

        const alumnoData = {
            nombre: alumno.nombre.trim(),
            apellidos: alumno.apellidos.trim(),
            email: alumno.email.trim(),
            telefono: alumno.telefono || "",
            password: alumno.password.trim(),
            curso: alumno.curso,
            profesor: alumno.profesor,
            estado_formacion: alumno.estado_formacion,
            observaciones: alumno.observaciones || "",
        };

        console.log("📤 Datos antes de validar:", alumnoData);

        if (!alumnoData.nombre || !alumnoData.apellidos || !alumnoData.email ||
            !alumnoData.password || !alumnoData.profesor || !alumnoData.curso || !alumnoData.estado_formacion) {
            console.log("❌ Falta algún campo obligatorio:", alumnoData);
            setError("Todos los campos obligatorios deben completarse.");
            setLoading(false);
            return;
        }

        try {
            if (editData) {
                console.log("🔄 Actualizando alumno con ID:", editData.id);
                await updateAlumno(editData.id, alumnoData);
            } else {
                await addAlumno(alumnoData);
            }
            
            setLoading(false); // ✅ Asegurar que loading se desactive antes de cerrar el modal

            // ⏳ Retrasar cierre del modal para evitar re-render inmediato
            setTimeout(() => {
                onSave();
                onClose();
            }, 200);
            
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-[600px]">
                <h2 className="text-xl font-bold mb-4">{editData ? "Editar Alumno" : "Agregar Alumno"}</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <input type="text" name="nombre" value={alumno.nombre} onChange={handleChange} placeholder="Nombre" className="w-full p-2 border rounded" required />
                    <input type="text" name="apellidos" value={alumno.apellidos} onChange={handleChange} placeholder="Apellidos" className="w-full p-2 border rounded" required />
                    <input type="email" name="email" value={alumno.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
                    <input type="text" name="telefono" value={alumno.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full p-2 border rounded" />

                    <div className="col-span-2">
                        <label className="block mb-2">Contraseña</label>
                        <div className="flex gap-2">
                            <input type="text" name="password" value={alumno.password} onChange={handleChange} className="w-full p-2 border rounded" required />
                            <button type="button" onClick={handleGeneratePassword} className="bg-gray-300 px-3 py-2 rounded text-sm">Generar</button>
                        </div>
                    </div>

                    <select name="profesor" value={alumno.profesor} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="1">Ana</option>
                        <option value="2">Antonio</option>
                    </select>

                    <select name="curso" value={alumno.curso} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="B1+B2">B1+B2</option>
                    </select>

                    <select name="estado_formacion" value={alumno.estado_formacion} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="demo">Demo</option>
                        <option value="matriculado">Matriculado</option>
                        <option value="completado">Completado</option>
                        <option value="expirado">Expirado</option>
                    </select>

                    <textarea
                        name="observaciones"
                        value={alumno.observaciones}
                        onChange={handleChange}
                        placeholder="Observaciones"
                        className="w-full p-2 border rounded col-span-2"
                    />

                    <div className="col-span-2 flex justify-end mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancelar</button>
                        <button type="submit" disabled={loading} className={`px-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-blue-500 text-white"}`}>
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AlumnoModal;
