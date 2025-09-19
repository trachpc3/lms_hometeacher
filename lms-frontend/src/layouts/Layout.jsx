// src/layouts/Layout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";   // 👈 IMPORTANTE
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getUserFromLocalStorage } from "../hooks/useUser";
import { useUnread } from "@/hooks/useUnread"; // 👈 NUEVO

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = getUserFromLocalStorage();

  const { unreadMessages, unreadNotifs } = useUnread(); // 👈 NUEVO

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const startTutorial = () => {
    alert("Aquí iría el tutorial o tour guiado.");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Botón hamburguesa para móvil */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden absolute top-4 left-4 z-50 bg-white border border-gray-300 rounded-md p-2 shadow"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform bg-white shadow-lg transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:translate-x-0 md:w-72`}
      >
        <Sidebar
          currentLevel={"A1"}
          onLevelChange={(level) => console.log("Nivel cambiado:", level)}
          onUpgradeClick={() => (window.location.href = "/pricing")}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        {/* Header fijo arriba */}
        <div className="sticky top-0 z-30 bg-gray-50 shadow-md">
          <Header
            startTutorial={startTutorial}
            handleLogout={handleLogout}
            toggleSidebar={() => setIsSidebarOpen((o) => !o)}
            unreadMessages={unreadMessages}
            unreadNotifs={unreadNotifs}
          />
        </div>

        {/* Contenido dinámico */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />   {/* 👈 AQUÍ SE INYECTAN LAS PÁGINAS HIJAS */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
