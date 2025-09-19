// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import toast from "react-hot-toast";

import CountdownBanner from "@/components/ui/CountdownBanner";
import { getUserFromLocalStorage } from "@/hooks/useUser";
import { fetchUnits } from "@/services/unitsService";
import { levels } from "@/data/levelsData";
import { fetchProgress } from "@/services/progressService";

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
  const outlet = useOutletContext() || {};
  // Nivel viene del Layout; fallback a localStorage por acceso directo
  const currentLevel = outlet.currentLevel || localStorage.getItem("lastLevel") || "Beginners";

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

    // Mensaje de bienvenida solo para alumnos en demo
    if (
      userData.rol !== "profesor" &&
      userData.metodo_registro === "manual" &&
      userData.estado_formacion === "demo"
    ) {
      toast.success(`👋 Bienvenido/a ${userData.nombre}. Tienes 24h para aprovechar tu acceso demo`);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user.id || !currentLevel) return;
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

      const unique = Array.from(new Map(unidades.map((u) => [u.id, u])).values());
      setUnits(unique);
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Banner solo para alumnos en demo (no profesores) */}
      {user.rol !== "profesor" && user.estado_formacion === "demo" && <CountdownBanner />}

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
