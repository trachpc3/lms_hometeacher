import { useState } from "react";
import HeaderProfesor from "@/components/HeaderProfesor";
import Sidebar from "@/components/Sidebar"; // o tu sidebar de profesor
import { useUnread } from "@/hooks/useUnread";
import { getUserFromLocalStorage } from "@/hooks/useUser";

export default function ProfesorLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { unreadMessages, unreadNotifs } = useUnread();
  const user = getUserFromLocalStorage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform bg-white shadow-lg transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:translate-x-0 md:w-72`}
      >
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        <div className="sticky top-0 z-30 bg-gray-50 shadow-md">
          <HeaderProfesor
            user={user}
            toggleSidebar={() => setIsSidebarOpen((o) => !o)}
            handleLogout={handleLogout}
            unreadMsgs={unreadMessages}   // 👈 aquí va el número
            unreadNotifs={unreadNotifs}
          />
        </div>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
