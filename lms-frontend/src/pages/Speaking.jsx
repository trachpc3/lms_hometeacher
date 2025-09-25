import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import logo from '../assets/loog.png';
import RolePlay from '../components/speaking/RolePlay';
import TutorialModal from '../components/TutorialModal';

const Speaking = () => {
  const { unitId } = useParams();

  // ✅ estados que faltaban
  const [speakingItems, setSpeakingItems] = useState([]);
  const [actividadId, setActividadId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  useEffect(() => {
    const loadSpeaking = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (!token) throw new Error('No hay token. Inicia sesión.');

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

        // Intentamos leer como texto por si el backend devuelve HTML en errores
        const raw = await res.text();
        if (!res.ok) throw new Error(`Error del servidor (${res.status}): ${raw}`);

        const data = raw ? JSON.parse(raw) : [];
        const items = Array.isArray(data) ? data : [];
        setSpeakingItems(items);
        // ✅ si viene un array, elegimos la primera actividad por defecto
        setActividadId(items[0]?.id ?? null);
      } catch (err) {
        console.error('❌ Error cargando actividad Speaking:', err);
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadSpeaking();
  }, [unitId]);

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
          'Escoge si quieres interpretar a Karen o Paul.',
          'Graba tu parte y escucha la respuesta del otro personaje.',
          'Al final podrás escuchar el diálogo completo con tu voz.',
        ]}
      />
    </div>
  );
};

export default Speaking;
