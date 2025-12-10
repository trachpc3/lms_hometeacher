// src/pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Lock, Unlock, Menu } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/HeaderAlumno";
import SidebarProfesor from "@/components/SidebarProfesor";
import HeaderProfesor from "@/components/HeaderProfesor";
import CountdownBanner from "@/components/ui/CountdownBanner";

import { getUserFromLocalStorage } from "@/hooks/useUser";
import { fetchUnits } from "@/services/unitsService";
import { levels } from "@/data/levelsData";
import { fetchProgress } from "@/services/progressService";

// ✅ CORREGIDO: usar los IDs minúscula del nivel (coinciden con levelsData.js)
const levelToNumber = {
  beginners: 1,
  lower: 2,
  intermediate: 3,
  upper: 4,
  advanced: 5,
  business: 6,
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const unitsGridRef = useRef(null);

  const [currentLevel, setCurrentLevel] = useState(() => {
    const saved = localStorage.getItem("lastLevel");
    return saved && levels.find((l) => l.id === saved) ? saved : levels[0].id;
  });

  const [units, setUnits] = useState([]);
  const [progress, setProgress] = useState({});
  const [user, setUser] = useState({ nombre: "", imagen: "", estado: "", rol: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isProfesor = user?.rol === "profesor";
  const showDashboard = location.pathname === "/home";

  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(userData);

    if (
      userData.rol !== "profesor" &&
      userData.metodo_registro === "manual" &&
      userData.estado_formacion === "demo"
    ) {
      toast.success(`👋 Bienvenido/a ${userData.nombre}. Tienes 24h para aprovechar tu acceso demo`);
    }
  }, [navigate]);

  useEffect(() => {
    const nivel = levelToNumber[currentLevel];
    if (!user.id || !nivel) return;

    console.log("📦 Cargando unidades para nivel:", currentLevel, "→ id:", nivel);
    cargarUnidades(nivel, user.rol);
    cargarProgreso(user.id);
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
      console.error("❌ Error cargando progreso:", error?.message);
    }
  };

  const handleLevelChange = (levelId) => {
    setCurrentLevel(levelId);
    localStorage.setItem("lastLevel", levelId);
    const nivel = levelToNumber[levelId];
    cargarUnidades(nivel, user.rol);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    toast(`👋 Hasta pronto, ${user?.nombre || "usuario"}`, { icon: "🚪" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const HeaderToUse = isProfesor ? HeaderProfesor : Header;
  const SidebarToUse = isProfesor ? SidebarProfesor : Sidebar;

  return (
    <div className="flex h-screen overflow-hidden relative">
      <button
        className="absolute top-4 left-4 z-50 bg-white border border-gray-300 rounded-md p-2 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      <SidebarToUse
        ref={sidebarRef}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        {...(!isProfesor ? { currentLevel, onLevelChange: handleLevelChange } : {})}
      />

      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        <div className="sticky top-0 z-40 bg-gray-50 shadow-md border-b border-gray-300">
          <HeaderToUse
            user={user}
            handleLogout={handleLogout}
            toggleSidebar={() => setIsSidebarOpen((v) => !v)}
          />
        </div>

        <main ref={unitsGridRef} className="flex-1 p-6 overflow-y-auto bg-gray-100">
          {showDashboard ? (
            <>
              {/* {!isProfesor && user.estado_formacion === "demo" && <CountdownBanner />} */}

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
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
