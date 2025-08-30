import { HelpCircle, Phone, Menu, LogOut, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getAvatarUrl } from "@/utils/getAvatarUrl";
import { useState } from "react";

const Header = ({ startTutorial, handleLogout, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Genera la URL del avatar dinámicamente
  const avatarSrc = getAvatarUrl(user?.imagen);

  return (
    <header className="bg-gray-50 p-2 md:p-4 flex items-center justify-between shadow-md border-b border-gray-300 z-50 relative">
      {/* Botón hamburguesa para móvil */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      {/* Espacio reservado para logo o título */}
      <div className="flex items-center gap-2 md:gap-4" />

      {/* Acciones */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={startTutorial}
          className="flex items-center gap-2 text-blue-600 font-semibold text-sm md:text-base"
        >
          <HelpCircle size={20} />
          Tutorial
        </button>

        <a
          href="https://calendly.com/hometeacher-empresas"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white font-semibold px-3 py-1 rounded-md flex items-center gap-2 text-sm md:text-base hover:bg-blue-700 transition"
        >
          <Phone size={18} />
          ¿Te llamamos?
        </a>

        {/* Perfil */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2"
          >
            <span className="text-gray-700 font-semibold text-sm md:text-base">
              Hola {user?.nombre || "Usuario"}
            </span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-300 bg-gray-100">
              <img
                src={avatarSrc}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getAvatarUrl("default-profile.jpg");
                }}
              />
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => navigate("/perfil")}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <CheckCircle size={18} className="text-blue-500" />
                Mi Perfil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
