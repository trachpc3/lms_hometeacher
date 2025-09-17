import { useState, useEffect, useMemo } from "react";
import { Pencil, Trash, PlusCircle, Search } from "lucide-react";
import { fetchAlumnos, addAlumno, updateAlumno, deleteAlumno } from "../services/alumnosService";
import AlumnoModal from "../components/AlumnoModal";

const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "N/A";
  return d
    .toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
    .replace(/\//g, ".");
};

const Alumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [filtroCampo, setFiltroCampo] = useState("nombre");
  const [filtroTexto, setFiltroTexto] = useState("");

  useEffect(() => {
    cargarAlumnos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarAlumnos = async () => {
  setLoading(true);
  setErr(null);

  try {
    const token = localStorage.getItem("token"); // <-- ¿existe?
    console.log("🔑 token (localStorage):", token ? token.slice(0, 16) + "..." : "(no hay)");

    const resp = await fetch("/api/alumnos", {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include", // por si usas cookie de refresh
    });

    console.log("🌐 GET /api/alumnos -> status:", resp.status);

    const text = await resp.text();
    console.log("📦 body (raw):", text);

    // intenta parsear JSON (si es JSON)
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    // normaliza a lista
    const list = Array.isArray(data) ? data : data?.data || [];

    // pinta algo de diagnóstico útil
    console.log("🧮 parsed list length:", Array.isArray(list) ? list.length : "(no array)");

    if (!resp.ok) {
      setErr(data?.message || `HTTP ${resp.status}`);
      setAlumnos([]);
    } else {
      setAlumnos(list);
    }
  } catch (e) {
    console.error("❌ Error fetch /api/alumnos:", e);
    setErr(e.message || "Error de red");
    setAlumnos([]);
  } finally {
    setLoading(false);
  }
};


  const handleSave = async (alumno) => {
    try {
      if (editData) {
        await updateAlumno(editData.id, alumno);
      } else {
        await addAlumno(alumno);
      }
      setModalOpen(false);
      setEditData(null);
      await cargarAlumnos();
    } catch (e) {
      console.error("Error guardando alumno:", e);
      alert("No se pudo guardar el alumno.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar (desactivar) este alumno?")) return;
    try {
      await deleteAlumno(id);
      await cargarAlumnos();
    } catch (e) {
      console.error("Error eliminando alumno:", e);
      alert("No se pudo eliminar el alumno.");
    }
  };

  // Campo de curso tolerante: curso_nombre (JOIN) o curso_matriculado (texto legacy)
  const getCurso = (a) => a?.curso_nombre || a?.curso_matriculado || "N/A";

  // Campo estado mostrado: puedes elegir entre estado (activo/inactivo) o estado_formacion (demo/matriculado...)
  const getEstado = (a) => a?.estado_formacion || a?.estado || "N/A";

  const alumnosFiltrados = useMemo(() => {
    const term = (filtroTexto || "").toLowerCase().trim();
    if (!term) return alumnos;

    return alumnos.filter((a) => {
      let val = "";
      switch (filtroCampo) {
        case "nombre":
          val = `${a?.nombre || ""} ${a?.apellidos || ""}`;
          break;
        case "email":
          val = a?.email || "";
          break;
        case "telefono":
          val = a?.telefono || "";
          break;
        case "curso":
          val = getCurso(a);
          break;
        default:
          val = String(a?.[filtroCampo] ?? "");
      }
      return val.toLowerCase().includes(term);
    });
  }, [alumnos, filtroCampo, filtroTexto]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Mis Alumnos</h1>
        <button
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
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
          <option value="curso">Curso</option>
        </select>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-10 p-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
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
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : err ? (
              <tr>
                <td colSpan="8" className="text-center p-6 text-red-600">
                  {err}
                </td>
              </tr>
            ) : alumnosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  No hay alumnos encontrados
                </td>
              </tr>
            ) : (
              alumnosFiltrados.map((alumno) => (
                <tr key={alumno.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {alumno.nombre} {alumno.apellidos ? ` ${alumno.apellidos}` : ""}
                  </td>
                  <td className="p-3">{alumno.email}</td>
                  <td className="p-3">{alumno.telefono || "N/A"}</td>
                  <td className="p-3">{formatDate(alumno.fecha_registro)}</td>
                  {/* si backend no envía fecha_baja en el SELECT, quedará N/A */}
                  <td className="p-3">{formatDate(alumno.fecha_baja)}</td>
                  <td className="p-3">{getEstado(alumno)}</td>
                  <td className="p-3">{getCurso(alumno)}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setEditData(alumno);
                          setModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(alumno.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <AlumnoModal onClose={() => setModalOpen(false)} onSave={handleSave} editData={editData} />
      )}
    </div>
  );
};

export default Alumnos;
