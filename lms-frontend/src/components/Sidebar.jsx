import { Unlock, Lock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/loog.png";
import { levels } from "../data/levelsData";
import { useUser } from "../context/UserContext"; // ✅

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, currentLevel, onLevelChange }) => {
  const navigate = useNavigate();
  const { user } = useUser(); // ✅
  const isAdmin = user?.rol === "admin" || user?.rol === "administrador";

  return (
    <aside className={`fixed inset-y-0 left-0 bg-white z-50 w-72 transition-transform transform ${
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0 md:relative md:flex md:w-72 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] border-r border-gray-300`}>
      <div className="p-6 flex flex-col justify-between h-full w-full">

        {/* Logo con navegación */}
        <div className="flex justify-center mb-4 cursor-pointer" onClick={() => navigate("/home")}>
          <img src={logo} alt="HomeTeacher Logo" className="w-32" />
        </div>

        {/* Niveles */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Niveles</h2>
          <div className="space-y-2">
            {levels.map((level) => {
              const isUnlocked = isAdmin || level.unlocked;

              return (
                <button
                  key={level.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold shadow-md ${
                    currentLevel === level.id ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    console.log("📌 Nivel seleccionado:", level.id);
                    onLevelChange(level.id);
                  }}
                  disabled={false}
                >
                  {isUnlocked ? (
                    <Unlock className="text-green-500" size={20} />
                  ) : (
                    <Lock className="text-red-500" size={20} />
                  )}
                  {level.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón Activa tu plan */}
        <button
          onClick={() => navigate("/pricing")}
          className="w-full mt-4 py-3 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2"
        >
          Activa tu plan <Lock size={20} />
        </button>

        {/* Botón cerrar en mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-2 right-2 md:hidden w-8 h-8 flex items-center justify-center border border-blue-600 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition"
        >
          <X size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
