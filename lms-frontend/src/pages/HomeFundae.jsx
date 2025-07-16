import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Menu, Clock, UserPlus, CheckCircle2 } from "lucide-react";
import HeaderFundae from "../components/HeaderFundae";
import SidebarFundae from "../components/SidebarFundae";
import {
  fetchUltimosEnvios,
  fetchUltimosUsuarios,
  fetchUsuariosFinalizados
} from "../services/fundaeService";

export default function HomeFundae() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ultimosEnvios, setUltimosEnvios] = useState([]);
  const [ultimosUsuarios, setUltimosUsuarios] = useState([]);
  const [usuariosFinalizados, setUsuariosFinalizados] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    fetchUltimosEnvios().then(setUltimosEnvios);
    fetchUltimosUsuarios().then(setUltimosUsuarios);
    fetchUsuariosFinalizados().then(setUsuariosFinalizados);
  }, []);

  const isHome = location.pathname === "/fundae";

  return (
    <div className="flex h-screen overflow-hidden relative">
      <button onClick={() => setIsSidebarOpen(s => !s)} className="absolute top-4 left-4 z-50 bg-white border border-gray-300 rounded-md p-2 md:hidden">
        <Menu size={24} />
      </button>

      <SidebarFundae isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        <div className="sticky top-0 bg-gray-50 shadow-md border-b z-40">
          <HeaderFundae
            user={JSON.parse(localStorage.getItem("user"))}
            toggleSidebar={() => setIsSidebarOpen(s => !s)}
            handleLogout={handleLogout}
          />
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          {isHome ? (
            <>
              <h1 className="text-2xl font-bold text-gray-700 mb-6">Panel de gestión Fundæ</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card: Envío de participantes */}
                <div className="bg-white p-6 shadow rounded-lg flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={28} className="text-blue-500" />
                    <h2 className="text-xl font-semibold">Enviar Participante</h2>
                  </div>
                  <Link to="/fundae/participante" className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-center">
                    Ir a envío
                  </Link>
                </div>

                {/* Card: Últimos envíos */}
                <div className="bg-white p-6 shadow rounded-lg overflow-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={28} className="text-green-500" />
                    <h2 className="text-xl font-semibold">Últimos 5 envíos</h2>
                  </div>
                  <ul className="text-gray-700 text-sm space-y-2">
                    {ultimosEnvios.length > 0 ? ultimosEnvios.map(e => (
                      <li key={e.id} className="flex justify-between gap-2">
                        <span>ID {e.id}</span>
                        <span className={e.estado === "ok" ? "text-green-600" : "text-red-600"}>{e.estado}</span>
                        <span>{new Date(e.created_at).toLocaleDateString()}</span>
                      </li>
                    )) : <li>No hay envíos recientes</li>}
                  </ul>
                </div>

                {/* Card: Últimos usuarios añadidos */}
                <div className="bg-white p-6 shadow rounded-lg overflow-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <UserPlus size={28} className="text-purple-500" />
                    <h2 className="text-xl font-semibold">Últimos 5 usuarios</h2>
                  </div>
                  <ul className="text-gray-700 text-sm space-y-2">
                    {ultimosUsuarios.length > 0 ? ultimosUsuarios.map(u => (
                      <li key={u.id} className="flex flex-col">
                        <div className="flex justify-between">
                          <span>{u.nombre}</span>
                          <span>{u.estado_formacion}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Alta: {new Date(u.fecha_registro).toLocaleDateString()}</span>
                          <span>Fin: {u.fecha_finalizacion ? new Date(u.fecha_finalizacion).toLocaleDateString() : "-"}</span>
                        </div>
                      </li>
                    )) : <li>No se han añadido usuarios aún</li>}
                  </ul>
                </div>

                {/* Card: Usuarios finalizados */}
                <div className="bg-white p-6 shadow rounded-lg overflow-auto col-span-full md:col-span-3">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 size={28} className="text-yellow-500" />
                    <h2 className="text-xl font-semibold">Usuarios Finalizados</h2>
                  </div>
                  <ul className="text-gray-700 text-sm space-y-2">
                    {usuariosFinalizados.length > 0 ? usuariosFinalizados.map(u => (
                      <li key={u.id} className="flex justify-between items-center">
                        <span>{u.nombre}</span>
                        <span>{new Date(u.fecha_finalizacion).toLocaleDateString()}</span>
                        <Link to={`/fundae/participante?userId=${u.id}`} className="text-blue-600 hover:underline">Enviar</Link>
                      </li>
                    )) : <li>No hay usuarios finalizados</li>}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              {location.pathname === "/fundae/participante" && (
                <h1 className="text-2xl font-bold mb-6">Enviar participante a FUNDAE</h1>
              )}
              {location.pathname === "/fundae/envios" && (
                <h1 className="text-2xl font-bold mb-6">Listado de envíos a FUNDAE</h1>
              )}
              <Outlet />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
