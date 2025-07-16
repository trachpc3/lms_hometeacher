import { useState } from "react";
import { HelpCircle, Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeaderProfesor = ({ user, toggleSidebar, handleLogout }) => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    console.log("🔍 Usuario en HeaderProfesor:", user);
    console.log("📢 handleLogout recibido:", handleLogout); // Debug para ver si existe

    return (
        <header className="bg-gray-50 p-2 md:p-4 flex items-center justify-between shadow-md border-b border-gray-300 z-50 relative">
            {/* Botón hamburguesa para abrir/cerrar el sidebar (solo en móvil) */}
            <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
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

            {/* Acciones y perfil */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Dropdown de perfil */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2"
                    >
                        <span className="text-gray-700 font-semibold text-sm md:text-base">
                            Hola {user.nombre}
                        </span>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-300">
                            <img
                                src={
                                    user?.imagen && user.imagen !== "default-profile.jpg"
                                        ? user.imagen.startsWith("http") 
                                            ? user.imagen 
                                            : `http://localhost:5000/${user.imagen}`
                                        : "http://localhost:5000/uploads/default-profile.jpg"
                                }
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                            <button
                                onClick={() => navigate("/perfil")}
                                className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                <User size={18} className="text-blue-500" />
                                Mi Perfil
                            </button>
                            <button
                                onClick={() => {
                                    console.log("🔴 Clic en cerrar sesión (Profesor)");
                                    setDropdownOpen(false);
                                    if (typeof handleLogout === "function") {
                                        handleLogout();
                                    } else {
                                        console.error("❌ handleLogout no está definido correctamente");
                                    }
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
        </header>
    );
};

export default HeaderProfesor;
