import { useEffect, useState } from "react";
import { getNotificaciones, markNotifRead } from "@/services/notificacionesService";
import { useNavigate } from "react-router-dom";

export default function Notificaciones() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { notificaciones } = await getNotificaciones();
        setNotifs(notificaciones);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleOpen = async (row) => {
    try {
      if (!row.readAt) await markNotifRead(row.id);
      setNotifs(prev => prev.map(n => n.id === row.id ? { ...n, readAt: new Date().toISOString() } : n));
      if (row.linkUrl) navigate(row.linkUrl);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-6">Cargando notificaciones…</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🔔 Notificaciones</h1>

      {notifs.length === 0 ? (
        <p className="text-gray-500">No tienes notificaciones.</p>
      ) : (
        <ul className="space-y-2">
          {notifs.map(n => (
            <li
              key={n.id}
              className={`p-4 rounded-xl border shadow-sm bg-white flex items-start justify-between gap-4 ${
                n.readAt ? "opacity-75" : "bg-indigo-50"
              }`}
            >
              <div>
                <h2 className="font-semibold text-gray-800">{n.titulo}</h2>
                <p className="text-sm text-gray-600">{n.cuerpo}</p>
                <span className="text-[11px] text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpen(n)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    n.readAt ? "border hover:bg-gray-50" : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {n.readAt ? "Abrir" : "Marcar y abrir"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
