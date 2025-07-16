import { Link } from "react-router-dom";
import { LayoutDashboard, Users, ClipboardList, BookOpen, BarChart, DoorOpen, RefreshCw } from "lucide-react";
import logo from "../assets/loog.png";

const user = JSON.parse(localStorage.getItem("user"));

const SidebarFundae = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <aside className={`fixed inset-y-0 left-0 bg-white z-50 w-72 transition-transform transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:flex md:w-72
            shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] border-r border-gray-300`}>
            
            <div className="p-6 flex flex-col justify-between h-full w-full">

                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="HomeTeacher Logo" className="w-32" />
                </div>

                {/* Menú de navegación dinámico según el rol */}
<nav className="space-y-4">
  {user?.rol === "fundae" ? (
    <>
      <SidebarItem to="/fundae/" icon={LayoutDashboard} label="Inicio" onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} />
      <SidebarItem to="/fundae/usuarios" icon={Users} label="Mis Alumnos" onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} />
      <SidebarItem to="/fundae/renovaciones" icon={RefreshCw} label="Renovaciones" onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} />
      <SidebarItem to="/fundae/envios" icon={BarChart} label="Reportes" onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} />
    </>
  ) : (
    <>
      <SidebarItem to="/fundae/" icon={LayoutDashboard} label="Inicio" onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} />
      <SidebarItem to="/fundae/usuarios" icon={Users} label="Usuarios Fundae" onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} />
      <SidebarItem to="/fundae/renovaciones" icon={RefreshCw} label="Renovaciones" onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} />
      <SidebarItem to="/fundae/envios" icon={BarChart} label="Reportes" onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} />
    </>
  )}
</nav>

                {/* Entrar al Curso */}
                <SidebarItem to="/home" icon={DoorOpen} label="Entrar al Curso" className="bg-green-500 text-white hover:bg-green-600" onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} />
            </div>
        </aside>
    );
};

const SidebarItem = ({ to, icon: Icon, label, className = "", onClick }) => (
    <Link 
        to={to} 
        onClick={onClick} 
        className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold shadow-md bg-gray-100 hover:bg-gray-200 ${className}`}
    >
        <Icon size={20} /> {label}
    </Link>
);

export default SidebarFundae;