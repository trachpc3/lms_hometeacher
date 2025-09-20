// src/components/HeaderProfesor.jsx
import { useState, useEffect } from "react";
import {
  HelpCircle,
  Menu,
  LogOut,
  User,
  Bell,
  MessageCircle,
  Megaphone,
  LayoutDashboard,   // 👈 IMPORTANTE
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "@/utils/getAvatarUrl";
import SendNotificationModal from "@/components/SendNotificationModal";

const HeaderProfesor = ({
  user,
  toggleSidebar,
  handleLogout,
  unreadMsgs = 0,
  unreadNotifs = 0,
}) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("");
  const [sendOpen, setSendOpen] = useState(false);

  useEffect(() => {
    setAvatarSrc(getAvatarUrl(user?.imagen, user?._updatedAt));
  }, [user?.imagen, user?._updatedAt]);

  return (
    <header className="bg-gray-50 p-2 md:p-4 flex items-center justify-between shadow-md border-b border-gray-300 z-50 relative">
      {/* Botón hamburguesa (móvil) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
        aria-label="Abrir menú lateral"
      >
        <Menu size={24} />
      </button>

      {/* Centro de ayuda */}
      <button
        onClick={() => window.open("https://soporte.hometeacher.com", "_blank")}
        className="flex items-center gap-2 text-blue-600 font-semibold text-sm md:text-base"
      >
        <HelpCircle size={20} /> Centro de Ayuda
      </button>

      {/* Área derecha */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Volver al panel 👈 NUEVO */}
        <button
          onClick={() => navigate("/dashboard-profesor")}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          <LayoutDashboard size={18} />
          <span className="hidden md:inline">Volver al panel</span>
        </button>

        {/* Enviar aviso */}
        <button
          onClick={() => setSendOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Megaphone size={18} />
          <span className="hidden md:inline">Enviar aviso</span>
        </button>

        {/* Mensajes */}
        <button
          onClick={() => navigate("/dashboard-profesor/mensajes")}
          className="relative inline-flex items-center gap-2 p-2 md:px-3 md:py-2 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <MessageCircle size={20} />
          <span className="hidden md:inline font-medium">Mensajes</span>
          {unreadMsgs > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center font-semibold shadow">
              {unreadMsgs > 99 ? "99+" : unreadMsgs}
            </span>
          )}
        </button>

        {/* Notificaciones */}
        <button
          onClick={() => navigate("/notificaciones")}
          className="relative p-2 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <Bell size={20} />
          {unreadNotifs > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-indigo-600 text-white text-[10px] leading-4 text-center font-semibold shadow">
              {unreadNotifs > 99 ? "99+" : unreadNotifs}
            </span>
          )}
        </button>

        {/* Perfil */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2"
          >
            <span className="text-gray-700 font-semibold text-sm md:text-base">
              Hola {user?.nombre ?? "Usuario"}
            </span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-300">
              <img
                src={avatarSrc}
                alt="User"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getAvatarUrl(null);
                }}
              />
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-gray-100">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/perfil");
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <User size={18} className="text-blue-500" />
                Mi Perfil
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  if (typeof handleLogout === "function") handleLogout();
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal enviar aviso */}
      <SendNotificationModal open={sendOpen} onClose={() => setSendOpen(false)} />
    </header>
  );
};

export default HeaderProfesor;
