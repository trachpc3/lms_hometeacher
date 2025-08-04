import { API_BASE_URL } from '../../config';
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getUserFromLocalStorage } from "../../hooks/useUser";

const COLORS = ["#10B981", "#EF4444"];

const RechartStats = () => {
  const [stats, setStats] = useState(null);
  const user = getUserFromLocalStorage();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/stats/${user.id}`);
        const data = await res.json();
        if (data.success) {
          setStats(data);
        } else {
          console.error("❌ Error en stats:", data.message);
        }
      } catch (err) {
        console.error("❌ Error obteniendo stats:", err);
      }
    };

    if (user?.id) fetchStats();
  }, [user?.id]);

  if (!stats) return <p className="text-gray-500">Cargando estadísticas...</p>;

  const completadas = stats.actividades.completadas;
  const pendientes = stats.actividades.total - completadas;

  const actividadChartData = [
    { name: "Completadas", value: completadas },
    { name: "Pendientes", value: pendientes }
  ];

  const loginsChartData = stats.logins_por_mes.map((item) => ({
    mes: item.mes,
    cantidad: item.cantidad
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 📊 Conexiones por mes */}
      <div className="bg-white p-4 rounded shadow border">
        <h3 className="text-lg font-bold mb-2 text-gray-700">Conexiones Mensuales</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={loginsChartData}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📈 Progreso general */}
      <div className="bg-white p-4 rounded shadow border">
        <h3 className="text-lg font-bold mb-2 text-gray-700">Tendencia de Accesos</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={loginsChartData}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🍩 Actividades */}
      <div className="bg-white p-4 rounded shadow border">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Actividades Realizadas</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={actividadChartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label
            >
              {actividadChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RechartStats;
