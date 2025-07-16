import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, Users, ClipboardList, BarChart2 } from "lucide-react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";

import HeaderProfesor from "../components/HeaderProfesor";
import SidebarProfesor from "../components/SidebarProfesor";
import { getUserFromLocalStorage } from "../hooks/useUser";
import { fetchTeacherDashboard } from "../services/dashboardService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const DashboardProfesor = () => {
    const [user, setUser] = useState({ nombre: "", imagen: "" });
    const [stats, setStats] = useState({ alumnos: 0, actividades: 0, progreso: 0 });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const userData = getUserFromLocalStorage();
        if (!userData || userData.rol !== "profesor") {
            navigate("/");
            return;
        }
        setUser(userData);
        cargarDashboard();
    }, [navigate]);

    const cargarDashboard = async () => {
        const data = await fetchTeacherDashboard();
        setStats(data);
    };

    const handleLogout = () => {
        console.log("🔴 Cerrar sesión (Profesor)");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="flex h-screen overflow-hidden relative">
            <button
                className="absolute top-4 left-4 z-50 bg-white border border-gray-300 rounded-md p-2 md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <Menu size={24} />
            </button>

            <SidebarProfesor isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
                <div className="sticky top-0 z-40 bg-gray-50 shadow-md border-b border-gray-300">
                    <HeaderProfesor user={user} handleLogout={handleLogout} />
                </div>

                <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
                    <Outlet />

                    {location.pathname === "/dashboard-profesor" && (
                        <>
                            <h1 className="text-2xl font-bold text-gray-700 mb-6">Panel de Control</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white p-6 shadow-md rounded-lg flex items-center space-x-4">
                                    <Users className="text-blue-500" size={32} />
                                    <div>
                                        <h2 className="text-xl font-bold">{stats.alumnos}</h2>
                                        <p className="text-gray-600">Alumnos Asignados</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 shadow-md rounded-lg flex items-center space-x-4">
                                    <ClipboardList className="text-green-500" size={32} />
                                    <div>
                                        <h2 className="text-xl font-bold">{stats.actividades}</h2>
                                        <p className="text-gray-600">Actividades Pendientes</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 shadow-md rounded-lg flex items-center space-x-4">
                                    <BarChart2 className="text-purple-500" size={32} />
                                    <div>
                                        <h2 className="text-xl font-bold">{stats.progreso}%</h2>
                                        <p className="text-gray-600">Progreso Promedio</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-white p-6 shadow-md rounded-lg">
                                    <h2 className="text-lg font-semibold mb-4">Progreso de los Alumnos</h2>
                                    <Bar data={{ labels: ["Enero", "Febrero", "Marzo"], datasets: [{ label: "Progreso", data: [30, 50, 80], backgroundColor: "#3B82F6" }] }} />
                                </div>
                                <div className="bg-white p-6 shadow-md rounded-lg">
                                    <h2 className="text-lg font-semibold mb-4">Distribución de Actividades</h2>
                                    <Pie data={{ labels: ["Completadas", "Pendientes"], datasets: [{ data: [stats.actividades * 0.6, stats.actividades * 0.4], backgroundColor: ["#22C55E", "#EF4444"] }] }} />
                                </div>
                                <div className="bg-white p-6 shadow-md rounded-lg">
                                    <h2 className="text-lg font-semibold mb-4">Promedio de Calificaciones</h2>
                                    <Line data={{ labels: ["Enero", "Febrero", "Marzo"], datasets: [{ label: "Calificación", data: [70, 85, 90], borderColor: "#8B5CF6" }] }} />
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardProfesor;
