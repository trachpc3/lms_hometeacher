import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import logo from "../assets/loog.png";
import RolePlay from "../components/speaking/RolePlay";
import TutorialModal from "../components/TutorialModal";
import { Home } from "lucide-react";

const Speaking = () => {
  const { unitId } = useParams(); // ⚠️ Ojo: hablamos de unitId, no actividadId aquí
  const [actividadId, setActividadId] = useState(null);
  const [unitTitle, setUnitTitle] = useState("");
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const currentLevel = localStorage.getItem("lastLevel") || "Beginners";


useEffect(() => {
  const fetchActividadId = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/actividades/unidad/${unitId}/speaking`);
      
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error del servidor (${res.status}): ${errorText}`);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const raw = await res.text();
        console.error("⚠️ Respuesta inesperada:", raw);
        throw new Error(`Respuesta no es JSON: ${raw}`);
      }

      const actividad = await res.json();
      setActividadId(actividad.id);
      setUnitTitle(actividad.titulo || "Speaking");

    } catch (err) {
      console.error("❌ Error cargando actividad Speaking:", err.message);
    }
  };

  fetchActividadId();
}, [unitId]);


  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <Link to="/home" className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          <h1 className="text-2xl font-bold text-gray-800">
            Unit {unitId}: Speaking
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
          {actividadId ? (
            <RolePlay actividadId={actividadId} />
          ) : (
            <p className="text-center text-gray-500">Cargando actividad...</p>
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
