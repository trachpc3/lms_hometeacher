// src/pages/HomeContent.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import CountdownBanner from "@/components/ui/CountdownBanner";
import { getUserFromLocalStorage } from "@/hooks/useUser";
import { fetchUnits } from "@/services/unitsService";
import { fetchProgress } from "@/services/progressService";
import { levels } from "@/data/levelsData";

const levelToNumber = {
  Beginners: 1,
  Lower: 2,
  Intermediate: 3,
  Upper: 4,
  Advanced: 5,
  Business: 6,
};

export default function HomeContent() {
  const location = useLocation();
  const unitsGridRef = useRef(null);

  const [currentLevel, setCurrentLevel] = useState(() => {
    const saved = localStorage.getItem("lastLevel");
    return saved && levels.find((l) => l.id === saved) ? saved : levels[0].id;
  });
  const [units, setUnits] = useState([]);
  const [progress, setProgress] = useState({});
  const user = getUserFromLocalStorage();
  const isProfesor = user?.rol === "profesor";

  const showDashboard = location.pathname.endsWith("/home") || location.pathname.endsWith("/curso");

  useEffect(() => {
    if (!user?.id) return;
    const nivel = levelToNumber[currentLevel];
    if (nivel) {
      (async () => {
        try {
          let data = await fetchUnits(nivel);
          if (user.rol === "admin" || user.rol === "administrador") {
            data = data.map((u) => ({ ...u, unlocked: true }));
          }
          const unique = Array.from(new Map(data.map((u) => [u.id, u])).values());
          setUnits(unique);
        } catch (e) {
          console.error("❌ Error cargando unidades:", e);
        }
      })();
      (async () => {
        try {
          const { progreso } = await fetchProgress(user.id);
          const map = {};
          progreso.forEach(({ unidad_id, actividad_id }) => {
            if (!map[unidad_id]) map[unidad_id] = new Set();
            map[unidad_id].add(actividad_id);
          });
          setProgress(map);
        } catch (e) {
          console.error("❌ Error cargando progreso:", e?.message);
        }
      })();
    }
  }, [currentLevel, user?.id, user?.rol]);

  // Permite que Sidebar (del alumno) cambie el nivel guardando en LS
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "lastLevel") {
        const v = localStorage.getItem("lastLevel");
        if (v && levels.find((l) => l.id === v)) setCurrentLevel(v);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!showDashboard) return null;

  return (
    <div ref={unitsGridRef} className="flex-1 p-6 overflow-y-auto bg-gray-100">
      {/* Banner demo SOLO alumnos */}
      {!isProfesor && user?.estado_formacion === "demo" && <CountdownBanner />}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-700">
          {levels.find((l) => l.id === currentLevel)?.name || currentLevel}
        </h1>
        <p className="text-gray-600">
          UNITS {levels.findIndex((l) => l.id === currentLevel) * 24 + 1}-
          {(levels.findIndex((l) => l.id === currentLevel) + 1) * 24}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {units.map((unit) => {
          const isAdmin = user?.rol === "admin" || user?.rol === "administrador";
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
                          isCompleted
                            ? "bg-blue-500 border-blue-500"
                            : "bg-gray-200 border-gray-400"
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
