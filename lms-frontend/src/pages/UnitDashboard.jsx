import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import logo from "../assets/loog.png";
import { getUserFromLocalStorage } from "../hooks/useUser";
import { fetchUnits } from "../services/unitsService";

const UnitDashboard = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [unitTitle, setUnitTitle] = useState(`Unit ${unitId}`);
  const [units, setUnits] = useState([]);
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(true); // ✅ estado controlado
  const currentLevel = localStorage.getItem("lastLevel") || "Beginners";

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    if (user.rol === "administrador") {
      setHasAccess(true);
      return;
    }

    const cargarUnidades = async () => {
      try {
        const unidadesDesbloqueadas = await fetchUnits(currentLevel);
        setUnits(unidadesDesbloqueadas);

        const unlocked = parseInt(unitId) === 1 ||
          unidadesDesbloqueadas.some(
            (unit) => unit.id === parseInt(unitId) && unit.unlocked
          );

        setHasAccess(unlocked);

        if (!unlocked) {
          console.warn(`🚫 Unidad ${unitId} bloqueada para ${user.nombre}`);
          navigate("/home");
        }
      } catch (error) {
        console.error("❌ Error cargando unidades:", error);
        setHasAccess(false);
        navigate("/home");
      }
    };

    cargarUnidades();
  }, [unitId, user, currentLevel, navigate]);

  useEffect(() => {
    const fetchUnitTitle = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/unidades/${unitId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error en la API: ${response.status}`);
        const data = await response.json();
        setUnitTitle(data.titulo || `Unit ${unitId}`);
      } catch (error) {
        console.error("❌ Error en la petición de unidad:", error);
      }
    };

    fetchUnitTitle();
  }, [unitId]);

  const cards = [
    { title: "Situation", description: "Comprensión", icon: "📺", link: `/unidad/${unitId}/situation`, bgColor: "bg-[#FF9800]" },
    { title: "Practice", description: "Aprende a pronunciar", icon: "👤", link: `/unidad/${unitId}/practice`, bgColor: "bg-[#E91E63]" },
    { title: "Listening", description: "Educa tu oído", icon: "🎧", link: `/unidad/${unitId}/listening`, bgColor: "bg-[#4CAF50]" },
    { title: "Grammar", description: "Aprende gramática", icon: "📘", link: `/unidad/${unitId}/grammar`, bgColor: "bg-[#2196F3]" },
    { title: "Assessment", description: "Evalúa conocimientos", icon: "❓", link: `/unidad/${unitId}/assessment`, bgColor: "bg-[#FF9800]" },
    { title: "Vocabulary", description: "Palabras aprendidas", icon: "📋", link: `/unidad/${unitId}/vocabulary`, bgColor: "bg-[#E91E63]" },
    { title: "Speaking", description: "Role Play", icon: "🗨️", link: `/unidad/${unitId}/speaking`, bgColor: "bg-[#4CAF50]" },
    { title: "Productive Skills", description: "Expresión escrita y hablada", icon: "✍️", link: `/unidad/${unitId}/productiveSkills`, bgColor: "bg-[#2196F3]" },
  ];

  if (!hasAccess) return null; // ✅ evita render si no hay acceso

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <header className="sticky top-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 border-b z-50">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold text-gray-800">
            Unit {unitId}: {unitTitle}
          </h1>
        </div>
        <Link
          to="/home"
          onClick={() => localStorage.setItem("lastLevel", currentLevel)}
          className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
        >
          <Home size={24} />
          Volver
        </Link>
      </header>

      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url('/pics/${unitId}.jpg')` }}
      ></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center p-10 backdrop-blur-md mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="relative bg-white shadow-xl rounded-xl p-8 hover:shadow-2xl transition transform hover:scale-105 backdrop-blur-md bg-opacity-80 text-center flex flex-col items-center"
            >
              <div className={`absolute -top-6 -left-6 w-16 h-16 flex items-center justify-center rounded-lg text-white shadow-lg ${card.bgColor}`}>
                <span className="text-3xl">{card.icon}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-6">{card.title}</h2>
              <p className="text-gray-600 text-lg mt-2">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitDashboard;
