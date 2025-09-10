// src/pages/Speaking.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import logo from "../assets/loog.png";
import RolePlay from "../components/speaking/RolePlay";
import TutorialModal from "../components/TutorialModal";
import api from "@/api"; // 👈 cliente axios central (envía Authorization y withCredentials)

const Speaking = () => {
  // Este componente puede montarse en 2 rutas:
  // 1) /unidad/:unitId/speaking  -> mostramos la 1ª actividad de speaking de esa unidad
  // 2) /speaking/:actividadId     -> abrimos directamente esa actividad
  const { unitId, actividadId: actividadIdParam } = useParams();

  const [speakingItems, setSpeakingItems] = useState([]);
  const [actividadId, setActividadId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadFromUnit() {
      // Endpoint esperado: GET /actividades/unidad/:unitId/speaking
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(`/actividades/unidad/${unitId}/speaking`);

        // La API podría devolver {items:[...]} o directamente [...]
        const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];

        if (!list.length) {
          throw new Error("No hay actividades de Speaking para esta unidad.");
        }

        if (!alive) return;
        setSpeakingItems(list);
        setActividadId(list[0]?.id ?? null);
      } catch (err) {
        if (!alive) return;
        console.error("❌ Error cargando Speaking por unidad:", err);
        setError(err?.response?.data?.message || err.message || "Error cargando Speaking.");
        setSpeakingItems([]);
        setActividadId(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    async function loadSingleActivity() {
      // Si viniera una ruta para coger 1 sola actividad, suele ser algo tipo:
      // GET /speaking/:actividadId  -> devuelve { id, ... } o un array [item]
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(`/speaking/${actividadIdParam}`);

        const item =
          (Array.isArray(data) ? data[0] : data) && (Array.isArray(data) ? data[0] : data);

        if (!item?.id) {
          throw new Error("No se encontró la actividad indicada.");
        }

        if (!alive) return;
        setSpeakingItems([item]);
        setActividadId(item.id);
      } catch (err) {
        if (!alive) return;
        console.error("❌ Error cargando Speaking por actividad:", err);
        setError(err?.response?.data?.message || err.message || "Error cargando Speaking.");
        setSpeakingItems([]);
        setActividadId(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (actividadIdParam) {
      loadSingleActivity();
    } else if (unitId) {
      loadFromUnit();
    } else {
      setLoading(false);
      setError("Ruta inválida: falta unitId o actividadId.");
    }

    return () => {
      alive = false;
    };
  }, [unitId, actividadIdParam]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          <h1 className="text-2xl font-bold text-gray-800">
            {unitId ? `Unit ${unitId}: Speaking` : "Speaking"}
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <HelpCircle size={20} />
            Tutorial
          </button>
          {unitId && (
            <>
              <Link
                to={`/unidad/${unitId}`}
                className="flex items-center gap-2 bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                <ArrowLeft size={24} />
                Volver
              </Link>
              <Link
                to={`/unidad/${unitId}/productiveSkills`}
                className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Siguiente
                <ArrowRight size={20} />
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl w-full border">
          {loading && <p className="text-center text-gray-500">Cargando actividad...</p>}

          {!loading && error && (
            <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">
              <p className="font-semibold">No se pudo cargar Speaking.</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && !actividadId && (
            <p className="text-center text-gray-500">No hay actividad disponible.</p>
          )}

          {!loading && !error && actividadId && (
            <RolePlay actividadId={actividadId} items={speakingItems} />
          )}
        </div>
      </div>

      <TutorialModal
        open={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="¿Cómo aprovechar esta actividad?"
        description="Practica tu pronunciación grabando el rol de uno de los personajes del diálogo."
        points={[
          "Escoge si quieres interpretar a Karen o Paul.",
          "Graba tu parte y escucha la respuesta del otro personaje.",
          "Al final podrás escuchar el diálogo completo con tu voz.",
        ]}
      />
    </div>
  );
};

export default Speaking;
