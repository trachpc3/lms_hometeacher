// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import toast from "react-hot-toast";

import CountdownBanner from "../components/ui/CountdownBanner";
import { getUserFromLocalStorage } from "../hooks/useUser";
import { fetchUnits } from "../services/unitsService";
import { levels } from "../data/levelsData";
import { fetchProgress } from "../services/progressService";

const levelToNumber = {
  Beginners: 1,
  Lower: 2,
  Intermediate: 3,
  Upper: 4,
  Advanced: 5,
  Business: 6,
};

export default function HomePage() {
  const navigate = useNavigate();

  const [currentLevel, setCurrentLevel] = useState(() => {
    const saved = localStorage.getItem("lastLevel");
    return saved && levels.find((l) => l.id === saved) ? saved : levels[0].id;
  });

  const [units, setUnits] = useState([]);
  const [progress, setProgress] = useState({});
  const [user, setUser] = useState({ nombre: "", imagen: "", estado: "", rol: "" });

  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(userData);

    if (userData.metodo_registro === "manual" && userData.estado_formacion === "demo") {
      toast.success(`👋 Bienvenido/a ${userData.nombre}. Tienes 24h para aprovechar tu acceso demo`);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user.id) return;
    const nivel = levelToNumber[currentLevel];
    if (nivel) {
      cargarUnidades(nivel, user.rol);
      cargarProgreso(user.id);
    }
  }, [currentLevel, user.id, user.rol]);

  useEffect(() => {
    const checkProgressUpdate = () => {
      if (localStorage.getItem("progressUpdated") === "true") {
        const nivel = levelToNumber[currentLevel];
        cargarUnidades(nivel, user.rol);
        cargarProgreso(user.id);
        localStorage.removeItem("progressUpdated");
      }
    };
    const interval = setInterval(checkProgressUpdate, 2000);
    return () => clearInterval(interval);
  }, [currentLevel, user.rol, user.id]);

  const cargarUnidades = async (levelId, userRole) => {
    try {
      let unidades = await fetchUnits(levelId);

      // Admin/administrador desbloquea todo
      if (userRole === "admin" || userRole === "administrador") {
        unidades = unidades.map((unit) => ({ ...unit, unlocked: true }));
      }

      const uniqueUnits = Array.from(new Map(unidades.map((u) => [u.id, u])).values());
      setUnits(uniqueUnits);
    } catch (error) {
      console.error("❌ Error cargando unidades:", error);
    }
  };

  const cargarProgreso = async (userId) => {
    try {
      const { progreso } = await fetchProgress(userId);
      const map = {};
      progreso.forEach(({ unidad_id, actividad_id }) => {
        if (!map[unidad_id]) map[unidad_id] = new Set();
        map[unidad_id].add(actividad_id);
      });
      setProgress(map);
    } catch (error) {
      console.error("❌ Error cargando progreso:", error.message);
    }
  };

  const handleLevelChange = (levelId) => {
    setCurrentLevel(levelId);
    localStorage.setItem("lastLevel", levelId);
    const nivel = levelToNumber[levelId];
    cargarUnidades(nivel, user.rol);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Selector de niveles (si lo necesitas en página; si ya lo tienes en el sidebar, puedes quitar esta sección) */}
      {/* Ejemplo simple de tabs de nivel: */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => handleLevelChange(lvl.id)}
            className={`px-4 py-2 rounded-xl border ${
              currentLevel === lvl.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700"
            }`}
          >
            {lvl.name}
          </button>
        ))}
      </div>

      {user.estado_formacion === "demo" && <CountdownBanner />}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-700">
          {levels.find((l) => l.id === currentLevel)?.name || currentLevel}
        </h1>
        <p className="text-gray-600">
          UNITS {levels.findIndex((l) => l.id === currentLevel) * 24 + 1}-
          {(levels.findIndex((l) => l.id === currentLevel) + 1) * 24}
        </p>
      </div>

      {/* Grid de unidades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {units.map((unit) => {
          const isAdmin = user.rol === "admin" || user.rol === "administrador";
          const isUnlocked = isAdmin || unit.id === 1 || unit.unlocked;

          return (
            <div
              key={unit.id}
              className="relative block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img
                src={`/pics/${unit.id}.jpg`}
                alt={`Unit ${unit.id}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">UNIT {unit.id}</h2>
                  {isUnlocked ? (
                    <Unlock className="text-green-500" size={20} />
                  ) : (
                    <Lock className="text-red-500" />
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{unit.titulo}</p>

                <div className="mt-3 flex gap-1 justify-center">
                  {[
                    "Situation",
                    "Practice",
                    "Listening",
                    "Grammar",
                    "Assessment",
                    "Vocabulary",
                    "Speaking",
                    "Writing",
                  ].map((_, index) => {
                    const isCompleted = progress[unit.id]?.has(index + 1);
                    return (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full border-2 ${
                          isCompleted ? "bg-blue-500 border-blue-500" : "bg-gray-200 border-gray-400"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {isUnlocked && <Link to={`/unidad/${unit.id}`} className="absolute inset-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
