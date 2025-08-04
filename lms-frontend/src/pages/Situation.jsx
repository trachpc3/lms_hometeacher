import { API_BASE_URL } from '../config';
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import logo from "../assets/loog.png";
import TutorialModal from "../components/TutorialModal";

const Situation = () => {
  const { unitId } = useParams();
  const [situation, setSituation] = useState(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);


  useEffect(() => {
    const fetchSituation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/situations/${unitId}`);
        if (!response.ok) throw new Error(`Error en la API: ${response.status}`);

        const data = await response.json();
        const videoId = data.video_url.split("/").pop();
        const embedUrl = `https://player.vimeo.com/video/${videoId}`;
        setSituation({ ...data, video_url: embedUrl });
      } catch (error) {
        console.error("❌ Error fetching situation:", error);
      }
    };

    fetchSituation();
  }, [unitId]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          <h1 className="text-2xl font-bold text-gray-800">
            Unit {unitId}: {situation ? situation.title : "Loading..."} : Situation
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <HelpCircle size={20} />
            Tutorial
          </button>
          <Link to={`/unidad/${unitId}`}
            className="flex items-center gap-2 bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition">
            <ArrowLeft size={24} />
            Volver
          </Link>
          <Link to={`/unidad/${unitId}/practice`}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Siguiente
            <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl w-full text-center border">
          {situation ? (
            <iframe
              src={situation.video_url}
              width="960"
              height="450"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full rounded-lg"
            ></iframe>
          ) : (
            <p className="text-gray-500">Cargando video...</p>
          )}
        </div>
      </div>

      <TutorialModal
  open={isTutorialOpen}
  onClose={() => setIsTutorialOpen(false)}
  title="¿Cómo aprovechar esta situación?"
  description="Escucha la situación tres veces: con subtítulos en inglés, en español y sin subtítulos."
  points={[
    "Observa cómo se usan los pronombres personales en contexto.",
    "Fíjate en el uso del verbo 'to be' en presente afirmativo.",
    "Piensa en cómo responderías tú en esa situación.",
  ]}
/>

    </div>
  );
};

export default Situation;
