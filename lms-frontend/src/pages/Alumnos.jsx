import { useState, useEffect } from "react";
import { Pencil, Trash, PlusCircle, Search } from "lucide-react";
import {
  fetchAlumnos,
  addAlumno,
  updateAlumno,
  deleteAlumno,
  fetchContadoresAlumnos,
} from "../services/alumnosService";
import AlumnoModal from "../components/AlumnoModal";
import AccionMasivaModal from "../components/AccionMasivaModal";
import toast, { Toaster } from "react-hot-toast";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date
    .toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, ".");
};

const Alumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filtroCampo, setFiltroCampo] = useState("nombre");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [soloMisAlumnos, setSoloMisAlumnos] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [misAlumnos, setMisAlumnos] = useState(0);

  const [seleccionados, setSeleccionados] = useState([]);
  const [accionMasivaOpen, setAccionMasivaOpen] = useState(false);

  useEffect(() => {
    cargarAlumnos();
    cargarContadores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soloMisAlumnos, filtroTexto, filtroCampo, page]);

  const cargarAlumnos = async () => {
    const params = {
      mine: soloMisAlumnos ? 1 : undefined,
      page,
      limit: 10,
    };

    if (filtroTexto) {
      params.q = filtroTexto;
    }

    const res = await fetchAlumnos(params);
    setAlumnos(res.alumnos);
    setTotal(res.total);
    setPages(res.pages);
    setSeleccionados([]); // reset selección al recargar
  };

  const cargarContadores = async () => {
    try {
      const res = await fetchContadoresAlumnos();
      setTotalAlumnos(res.totalAlumnos);
      setMisAlumnos(res.misAlumnos);
    } catch (error) {
      console.error("Error cargando contadores:", error);
    }
  };

  const handleSave = async (alumno) => {
    try {
      if (editData) {
        await updateAlumno(editData.id, alumno);
        toast.success("Alumno actualizado con éxito ✅");
      } else {
        await addAlumno(alumno);
        toast.success("Alumno agregado con éxito 🎉");
      }
      setModalOpen(false);
      setEditData(null);
      cargarAlumnos();
      cargarContadores();
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al guardar el alumno");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este alumno?")) {
      try {
        await deleteAlumno(id);
        toast.success("Alumno eliminado correctamente 🗑️");
        cargarAlumnos();
        cargarContadores();
      } catch (error) {
        console.error(error);
        toast.error("❌ Error al eliminar el alumno");
      }
    }
  };

  const handleAccionMasiva = async (accion, valor) => {
    try {
      if (accion === "eliminar") {
        await Promise.all(seleccionados.map((id) => deleteAlumno(id)));
        toast.success(`Se eliminaron ${seleccionados.length} alumnos 🗑️`);
      } else if (accion === "profesor") {
        await Promise.all(
          seleccionados.map((id) => updateAlumno(id, { profesor_asignado: valor }))
        );
        toast.success(`Alumnos reasignados a otro profesor ✅`);
      } else {
        await Promise.all(
          seleccionados.map((id) => updateAlumno(id, { [accion]: valor }))
        );
        toast.success(`Acción "${accion}" aplicada a ${seleccionados.length} alumnos ✅`);
      }

      await cargarAlumnos();
      await cargarContadores();
    } catch (error) {
      console.error("Error aplicando acción masiva:", error);
      toast.error("❌ Hubo un error al aplicar la acción masiva");
    } finally {
      setAccionMasivaOpen(false);
    }
  };

  const handleAnterior = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleSiguiente = () => {
    if (page < pages) setPage(page + 1);
  };

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSeleccionTodos = () => {
    if (seleccionados.length === alumnos.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(alumnos.map((a) => a.id));
    }
  };

  return (
    <div className="p-6">
      {/* Toaster global */}
      <Toaster position="top-right" />

      {/* 🔘 Botones toggle + Agregar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Alumnos</h1>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg overflow-hidden border">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setSoloMisAlumnos(false);
              }}
              className={`px-3 py-2 text-sm ${
                !soloMisAlumnos
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Todos ({totalAlumnos})
            </button>
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setSoloMisAlumnos(true);
              }}
              className={`px-3 py-2 text-sm border-l ${
                soloMisAlumnos
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Solo mis alumnos ({misAlumnos})
            </button>
          </div>

          <button
            onClick={() => {
              setEditData(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
          >
            <PlusCircle size={18} /> Agregar Alumno
          </button>

          {seleccionados.length > 0 && (
            <button
              onClick={() => setAccionMasivaOpen(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
            >
              Acciones masivas ({seleccionados.length})
            </button>
          )}
        </div>
      </div>

      {/* 🔍 Filtro */}
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
            onChange={(e) => {
              setFiltroTexto(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 p-2 border rounded-lg"
          />
        </div>
      </div>

      {/* 📋 Tabla */}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">
              <input
                type="checkbox"
                checked={seleccionados.length === alumnos.length && alumnos.length > 0}
                onChange={toggleSeleccionTodos}
              />
            </th>
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
          {alumnos.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center p-3 text-gray-500">
                No hay alumnos encontrados
              </td>
            </tr>
          ) : (
            alumnos.map((alumno) => (
              <tr key={alumno.id} className="border-b hover:bg-gray-100">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(alumno.id)}
                    onChange={() => toggleSeleccion(alumno.id)}
                  />
                </td>
                <td className="p-3">{alumno.nombre}</td>
                <td className="p-3">{alumno.email}</td>
                <td className="p-3">{alumno.telefono || "N/A"}</td>
                <td className="p-3">{formatDate(alumno.fecha_registro)}</td>
                <td className="p-3">{formatDate(alumno.fecha_baja)}</td>
                <td className="p-3">{alumno.estado_formacion || "N/A"}</td>
                <td className="p-3">
                  {alumno.curso_nombre || alumno.curso_matriculado || "N/A"}
                </td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setEditData(alumno);
                      setModalOpen(true);
                    }}
                    className="text-blue-600"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(alumno.id)}
                    className="text-red-600"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔄 Paginación */}
      {pages > 1 && (
        <div className="mt-6 flex justify-center gap-4 items-center text-sm">
          <button
            onClick={handleAnterior}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span>
            Página <strong>{page}</strong> de <strong>{pages}</strong> — Resultados:{" "}
            {alumnos.length}
          </span>
          <button
            onClick={handleSiguiente}
            disabled={page === pages}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}

      {modalOpen && (
        <AlumnoModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          editData={editData}
        />
      )}

      {accionMasivaOpen && (
        <AccionMasivaModal
          open={accionMasivaOpen}
          onClose={() => setAccionMasivaOpen(false)}
          onConfirm={handleAccionMasiva}
          seleccionados={seleccionados}
        />
      )}
    </div>
  );
};

export default Alumnos;
