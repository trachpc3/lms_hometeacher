// src/components/SidebarProfesor.jsx
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BookOpen,
  BarChart,
  DoorOpen,
  RefreshCw,
  Home,
} from "lucide-react";
import logo from "../assets/loog.png";

const SidebarProfesor = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const handleClose = () => setIsSidebarOpen && setIsSidebarOpen(false);

  const insideCurso = location.pathname.startsWith("/home");

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white z-50 w-72 transition-transform transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative md:flex md:w-72 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] border-r border-gray-300`}
      aria-label="Menú lateral profesor"
    >
      <div className="p-6 flex flex-col justify-between h-full w-full">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="HomeTeacher" className="w-32" />
        </div>

        {/* Menú */}
        <nav className="space-y-3" role="menu">
          <SidebarItem to="/dashboard-profesor" icon={LayoutDashboard} label="Inicio" onClick={handleClose} />
          <SidebarItem to="/dashboard-profesor/alumnos" icon={Users} label="Mis Alumnos" onClick={handleClose} />
          <SidebarItem to="/dashboard-profesor/renovaciones" icon={RefreshCw} label="Renovaciones" onClick={handleClose} />
          <SidebarItem to="/dashboard-profesor/actividades" icon={ClipboardList} label="Actividades Pendientes" onClick={handleClose} />
          <SidebarItem to="/dashboard-profesor/material" icon={BookOpen} label="Material de Clase" onClick={handleClose} />
          <SidebarItem to="/dashboard-profesor/reportes" icon={BarChart} label="Reportes" onClick={handleClose} />
        </nav>

        {/* Acciones inferiores */}
        <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
          {!insideCurso ? (
            <SidebarItem
              to="/home"
              icon={DoorOpen}
              label="Entrar al Curso"
              variant="primary"
              onClick={handleClose}
            />
          ) : (
            <SidebarItem
              to="/dashboard-profesor"
              icon={Home}
              label="Volver al Panel"
              variant="secondary"
              onClick={handleClose}
            />
          )}
        </div>
      </div>
    </aside>
  );
};

function SidebarItem({ to, icon: Icon, label, onClick, variant }) {
  const base =
    "w-full flex items-center gap-3 p-3 rounded-lg font-semibold transition shadow-sm";
  const variants = {
    default: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    active: "bg-blue-600 text-white hover:bg-blue-700",
    primary: "bg-green-500 text-white hover:bg-green-600",
    secondary: "bg-purple-500 text-white hover:bg-purple-600",
  };

  return (
    <NavLink
      to={to}
      onClick={onClick}
      role="menuitem"
      className={({ isActive }) =>
        `${base} ${
          variant ? variants[variant] : isActive ? variants.active : variants.default
        }`
      }
    >
      <Icon size={20} />
      {label}
    </NavLink>
  );
}

export default SidebarProfesor;
