import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Users,
  ClipboardList,
  BarChart2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

import HeaderProfesor from "../components/HeaderProfesor";
import SidebarProfesor from "../components/SidebarProfesor";
import { getUserFromLocalStorage } from "../hooks/useUser";
import { fetchTeacherDashboard } from "../services/dashboardService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const SkeletonCard = ({ icon }) => (
  <div className="bg-white p-6 shadow-md rounded-2xl flex items-center space-x-4">
    <div className="animate-pulse">{icon}</div>
    <div className="w-full">
      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white p-6 shadow-md rounded-2xl">
    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4" />
    <div className="h-64 bg-gray-100 rounded animate-pulse" />
  </div>
);

const useTimeAgo = (date) => {
  return useMemo(() => {
    if (!date) return "—";
    const diff = Date.now() - date.getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    return `${d}d`;
  }, [date]);
};

const DashboardProfesor = () => {
  const [user, setUser] = useState({ nombre: "", imagen: "" });
  const [stats, setStats] = useState({
    alumnos: 0,
    actividades: 0,
    progreso: 0,      // sigue existiendo para las gráficas
    renovaciones: 0,  // NUEVO para la card
  });
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const abortRef = useRef(null);

  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (!userData || userData.rol !== "profesor") {
      navigate("/");
      return;
    }
    setUser(userData);
    cargarDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const cargarDashboard = async () => {
    setLoading(true);
    setChartsLoading(true);
    setError(null);

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const data = await fetchTeacherDashboard({ signal: abortRef.current.signal });
      // Esperado: { alumnos, actividades, progreso?, renovaciones? }
      setStats({
        alumnos: Number(data.alumnos ?? 0),
        actividades: Number(data.actividades ?? 0),
        progreso: Number(data.progreso ?? 0),           // para la gráfica de progreso
        renovaciones: Number(data.renovaciones ?? 0),   // NUEVO mapeo
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.message || "No se pudo cargar el dashboard.");
    } finally {
      setLoading(false);
      setTimeout(() => setChartsLoading(false), 150);
    }
  };

  const timeAgo = useTimeAgo(lastUpdated);

  // ======= Datos para charts =======
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
  const progresoSerie = useMemo(() => {
    const base = [20, 35, 45, 55, 65, Math.max(10, Math.min(100, stats.progreso))];
    return base;
  }, [stats.progreso]);

  const actividadesDistribucion = useMemo(() => {
    const completadas = Math.round(stats.actividades * 0.6);
    const pendientes = Math.max(0, stats.actividades - completadas);
    return [completadas, pendientes];
  }, [stats.actividades]);

  const notasSerie = useMemo(() => [6.8, 7.2, 7.9, 8.1, 8.4, 8.6], []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" }, tooltip: { mode: "index", intersect: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 20 } } },
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Mobile toggle */}
      <button
        aria-label="Abrir menú lateral"
        className="absolute top-4 left-4 z-50 bg-white border border-gray-200 rounded-xl p-2 shadow md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={22} />
      </button>

      <SidebarProfesor isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        <div className="sticky top-0 z-40 bg-gray-50 shadow-sm border-b border-gray-200">
          <HeaderProfesor
            user={user}
            handleLogout={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
          />
        </div>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <Outlet />

          {location.pathname === "/dashboard-profesor" && (
            <>
              {/* Header del panel */}
              <div className="flex items-start justify-between mb-6 gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
                  <p className="text-sm text-gray-500">
                    Bienvenido, {user?.nombre || "profesor"} ·{" "}
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Activo
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={cargarDashboard}
                    className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 shadow-sm"
                  >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    Refrescar
                  </button>
                  <span className="text-xs text-gray-500">
                    {lastUpdated ? `Actualizado hace ${timeAgo}` : "—"}
                  </span>
                </div>
              </div>

              {/* Errores */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
                  <AlertTriangle className="mt-0.5" size={18} />
                  <div className="flex-1">
                    <p className="font-semibold">No se pudo cargar el dashboard.</p>
                    <p className="text-sm">{error}</p>
                  </div>
                  <button
                    onClick={cargarDashboard}
                    className="text-sm underline decoration-red-400 hover:decoration-red-600"
                  >
                    Reintentar
                  </button>
                </div>
              )}

             {/* Tarjetas de KPIs */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {loading ? (
    <>
      <SkeletonCard icon={<Users color="#3B82F6" size={32} />} />        {/* blue-500 */}
      <SkeletonCard icon={<ClipboardList color="#10B981" size={32} />} /> {/* emerald-500 */}
      <SkeletonCard icon={<RefreshCw color="#F59E0B" size={32} />} />     {/* orange-500 */}
    </>
  ) : (
    <>
      {/* 👥 Alumnos */}
      <div className="bg-white p-6 shadow-md rounded-2xl flex items-center gap-4">
        <Users color="#3B82F6" size={32} />
        <div>
          <h2 className="text-2xl font-bold leading-tight">{stats.alumnos}</h2>
          <p className="text-gray-600 text-sm">Alumnos Asignados</p>
        </div>
      </div>

      {/* 📋 Actividades */}
      <div className="bg-white p-6 shadow-md rounded-2xl flex items-center gap-4">
        <ClipboardList color="#10B981" size={32} />
        <div>
          <h2 className="text-2xl font-bold leading-tight">{stats.actividades}</h2>
          <p className="text-gray-600 text-sm">Actividades Pendientes</p>
        </div>
      </div>

      {/* 🔄 Renovaciones */}
      <div className="bg-white p-6 shadow-md rounded-2xl flex items-center gap-4">
        <RefreshCw color="#F59E0B" size={32} />
        <div>
          <h2 className="text-2xl font-bold leading-tight">{stats.renovaciones ?? 0}</h2>
          <p className="text-gray-600 text-sm">Renovaciones</p>
        </div>
      </div>
    </>
  )}
</div>


              {/* Gráficas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {chartsLoading ? (
                  <>
                    <SkeletonChart />
                    <SkeletonChart />
                    <SkeletonChart />
                  </>
                ) : (
                  <>
                    {/* Progreso de los alumnos */}
                    <div className="bg-white p-6 shadow-md rounded-2xl">
                      <h2 className="text-lg font-semibold mb-4">Progreso de los Alumnos</h2>
                      <div className="h-64">
                        <Bar
                          data={{
                            labels: meses,
                            datasets: [
                              {
                                label: "Progreso (%)",
                                data: progresoSerie,
                                backgroundColor: "#3B82F6",
                                borderRadius: 10,
                              },
                            ],
                          }}
                          options={chartOptions}
                        />
                      </div>
                    </div>

                    {/* Distribución de actividades */}
                    <div className="bg-white p-6 shadow-md rounded-2xl">
                      <h2 className="text-lg font-semibold mb-4">Distribución de Actividades</h2>
                      <div className="h-64 flex items-center justify-center">
                        <Pie
                          data={{
                            labels: ["Completadas", "Pendientes"],
                            datasets: [
                              {
                                data: actividadesDistribucion,
                                backgroundColor: ["#22C55E", "#EF4444"],
                                borderWidth: 0,
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            plugins: { legend: { position: "bottom" } },
                          }}
                        />
                      </div>
                    </div>

                    {/* Promedio de calificaciones */}
                    <div className="bg-white p-6 shadow-md rounded-2xl">
                      <h2 className="text-lg font-semibold mb-4">Promedio de Calificaciones</h2>
                      <div className="h-64">
                        <Line
                          data={{
                            labels: meses,
                            datasets: [
                              {
                                label: "Calificación",
                                data: notasSerie,
                                borderColor: "#8B5CF6",
                                backgroundColor: "rgba(139, 92, 246, 0.15)",
                                tension: 0.35,
                                fill: true,
                                pointRadius: 3,
                              },
                            ],
                          }}
                          options={{
                            ...chartOptions,
                            scales: {
                              y: { beginAtZero: true, suggestedMax: 10, ticks: { stepSize: 2 } },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardProfesor;
