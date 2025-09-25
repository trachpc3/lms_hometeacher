import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import logo from '../assets/loog.png';
import RolePlay from '../components/speaking/RolePlay';
import TutorialModal from '../components/TutorialModal';

const Speaking = () => {
  const { unitId } = useParams();

  const [speakingItems, setSpeakingItems] = useState([]);
  const [actividadId, setActividadId] = useState(null);
  const [meta, setMeta] = useState(null);

  const [error, setError] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // 🔁 Cargar metadatos de la actividad
  useEffect(() => {
    const loadSpeakingMeta = async () => {
      setLoadingMeta(true);
      setError(null);

      const token = (localStorage.getItem('token') || localStorage.getItem('accessToken') || '').trim();

      if (!token) {
        setError('No se encontró token válido. Inicia sesión nuevamente.');
        setLoadingMeta(false);
        return;
      }

      try {
        console.log("🔑 TOKEN usado:", token);

        const res = await fetch(
          `${API_BASE_URL}/actividades/unidad/${unitId}/speaking`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          }
        );

        const raw = await res.text();
        console.log("📡 Respuesta cruda:", raw);

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${raw || 'sin cuerpo'}`);
        }

        const json = raw ? JSON.parse(raw) : null;

        // ✅ Puede venir como array u objeto
        let actividad = Array.isArray(json) ? json[0] : json;

        console.log("🧠 Actividad recibida:", actividad);

        if (!actividad?.id) {
          throw new Error('No hay actividad Speaking para esta unidad.');
        }

        setMeta(actividad);
        setActividadId(actividad.id);
      } catch (err) {
        console.error('❌ Error cargando Speaking por unidad:', err);
        setError(err.message || 'Error desconocido');
      } finally {
        setLoadingMeta(false);
      }
    };

    loadSpeakingMeta();
  }, [unitId]);

  // 🔁 Cargar ítems si no los trae el componente RolePlay
  useEffect(() => {
    const loadItems = async () => {
      if (!actividadId) return;

      setLoadingItems(true);

      const token = (localStorage.getItem('token') || localStorage.getItem('accessToken') || '').trim();
      if (!token) {
        console.warn('⚠️ No hay token al cargar ítems de speaking');
        return;
      }

      const tryFetch = async (path) => {
        try {
          const res = await fetch(`${API_BASE_URL}${path}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          });

          if (!res.ok) return null;

          const raw = await res.text();
          if (!raw) return null;

          const json = JSON.parse(raw);
          return json;
        } catch (err) {
          console.warn(`⚠️ Fallo en fetch ${path}:`, err);
          return null;
        }
      };

      const candidates = [
        `/speaking/${actividadId}`,
        `/speaking/${actividadId}/items`,
      ];

      let found = null;

      for (const path of candidates) {
        // eslint-disable-next-line no-await-in-loop
        const data = await tryFetch(path);

        if (data) {
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.data)
            ? data.data
            : [];

          if (list.length) {
            found = list;
            break;
          }
        }
      }

      console.log("📦 Ítems de speaking cargados:", found);

      setSpeakingItems(found || []);
      setLoadingItems(false);
    };

    loadItems();
  }, [actividadId]);

  const loading = loadingMeta || loadingItems;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          <h1 className="text-2xl font-bold text-gray-800">Unit {unitId}: Speaking</h1>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <HelpCircle size={20} />
            Tutorial
          </button>
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
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl w-full border">
          {loading && (
            <p className="text-center text-gray-500">Cargando actividad...</p>
          )}

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
            <RolePlay actividadId={actividadId} items={speakingItems} meta={meta} />
          )}
        </div>
      </div>

      <TutorialModal
        open={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        title="¿Cómo aprovechar esta actividad?"
        description="Practica tu pronunciación grabando el rol de uno de los personajes del diálogo."
        points={[
          'Escoge si quieres interpretar a Karen o Paul.',
          'Graba tu parte y escucha la respuesta del otro personaje.',
          'Al final podrás escuchar el diálogo completo con tu voz.',
        ]}
      />
    </div>
  );
};

export default Speaking;
