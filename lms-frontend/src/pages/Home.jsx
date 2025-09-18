// src/pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Lock, Unlock, Menu } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
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

  // Mostrar dashboard (unidades) sólo cuando estamos exactamente en /home
  const showDashboard = location.pathname === "/home";

  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (!userData) {
      navigate("/"); // tu login está en "/"
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

      if (userRole === "admin" || userRole === "administrador") {
        unidades = unidades.map((unit) => ({ ...unit, unlocked: true }));
      }

      const uniqueUnits = Array.from(new Map(unidades.map((unit) => [unit.id, unit])).values());
      setUnits([...uniqueUnits]);
    } catch (error) {
      console.error("❌ Error cargando unidades:", error);
    }
  };

  const cargarProgreso = async (userId) => {
    try {
      const { progreso } = await fetchProgress(userId); // ✅ ya incluye el token

      const progresoMap = {};
      progreso.forEach(({ unidad_id, actividad_id }) => {
        if (!progresoMap[unidad_id]) progresoMap[unidad_id] = new Set();
        progresoMap[unidad_id].add(actividad_id);
      });

      setProgress(progresoMap);
    } catch (error) {
      console.error("❌ Error cargando progreso:", error.message);
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

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Toggle sidebar (móvil) */}
      <button
        className="absolute top-4 left-4 z-50 bg-white border border-gray-300 rounded-md p-2 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      <Sidebar
        ref={sidebarRef}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentLevel={currentLevel}
        onLevelChange={handleLevelChange}
      />

      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        {/* Header fijo */}
        <div className="sticky top-0 z-40 bg-gray-50 shadow-md border-b border-gray-300">
          <Header
            user={user}
            handleLogout={handleLogout}
            toggleSidebar={() => setIsSidebarOpen((v) => !v)} // ✅ importante para el botón hamburguesa del Header
          />
        </div>

        {/* Contenido */}
        <main ref={unitsGridRef} className="flex-1 p-6 overflow-y-auto bg-gray-100">
          {showDashboard ? (
            <>
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
            // 📌 Aquí se pintan las rutas hijas: /home/mensajes, etc.
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
