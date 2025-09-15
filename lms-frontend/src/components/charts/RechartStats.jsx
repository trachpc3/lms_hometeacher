import { API_BASE_URL } from '../../config';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getUserFromLocalStorage } from '../../hooks/useUser';

const COLORS = ['#10B981', '#EF4444'];

/**
 * RechartStats
 * Props:
 *  - userId?: string | number
 *  - token?: string (opcional; si no se pasa, lee de localStorage)
 */
export default function RechartStats({ userId, token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const effectiveUserId = userId ?? getUserFromLocalStorage()?.id;

  const getToken = () => token || localStorage.getItem('token') || localStorage.getItem('accessToken');
  const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

  const safeFetch = async (url, opts = {}) => {
    const res = await fetch(url, { credentials: 'include', ...opts });
    const raw = await res.text();
    const contentType = res.headers.get('content-type') || '';
    let data;
    try {
      data = contentType.includes('application/json') && raw ? JSON.parse(raw) : raw;
    } catch {
      data = raw;
    }
    if (!res.ok) {
      const msg = (typeof data === 'string' ? data : data?.error || data?.message) || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!effectiveUserId) return;
        const t = getToken();
        if (!t) throw new Error('No hay token. Inicia sesión.');

        const data = await safeFetch(`${API_BASE_URL}/stats/${effectiveUserId}`, {
          method: 'GET',
          headers: authHeaders(),
        });
        // Admite { success, ... } o el objeto directo
        setStats(data?.success ? data : data);
      } catch (err) {
        console.error('❌ Error obteniendo stats:', err);
        setError(err.message || 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [effectiveUserId, token]);

  if (loading) return <p className="text-gray-500">Cargando estadísticas...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return <p className="text-gray-500">Sin datos de estadísticas.</p>;

  const completadas = Number(stats?.actividades?.completadas ?? 0);
  const total = Number(stats?.actividades?.total ?? completadas);
  const pendientes = Math.max(0, total - completadas);

  const actividadChartData = [
    { name: 'Completadas', value: completadas },
    { name: 'Pendientes', value: pendientes },
  ];

  const logins = Array.isArray(stats?.logins_por_mes) ? stats.logins_por_mes : [];
  const loginsChartData = logins.map((item) => ({ mes: item.mes, cantidad: item.cantidad }));

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
            <Pie data={actividadChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
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
}
