// src/pages/ProfileProfesor.jsx
import { API_BASE_URL } from "../config";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  LogIn,
  Clock,
  Camera,
  User,
  Flag,
  BookOpen,
  BarChart,
  Menu,
  Users,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import HeaderProfesor from "../components/HeaderProfesor";
import { useUser } from "../context/UserContext";
import RechartStats from "../components/charts/RechartStats";
import { getAvatarUrl } from "../utils/getAvatarUrl";
import { saveUserToLocalStorage } from "../hooks/useUser";

// Helpers ---------------------------------------------------------------
const getToken = () =>
  localStorage.getItem("token") || localStorage.getItem("accessToken");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

const safeFetch = async (url, opts = {}) => {
  const res = await fetch(url, { credentials: "include", ...opts });
  const raw = await res.text();
  const contentType = res.headers.get("content-type") || "";
  let data;
  try {
    data =
      contentType.includes("application/json") && raw ? JSON.parse(raw) : raw;
  } catch {
    data = raw;
  }
  if (!res.ok) {
    const msg =
      (typeof data === "string"
        ? data
        : data?.error || data?.message) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

// Subcomponentes --------------------------------------------------------
function ProfileHeaderCard({ user, onUserChange }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const avatarUrl = useMemo(
    () =>
      previewImage ||
      getAvatarUrl(
        user.imagen?.startsWith("/uploads/")
          ? user.imagen.split("/").pop()
          : user.imagen
      ),
    [previewImage, user?.imagen]
  );

  const handleChangePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    const token = getToken();
    if (!file || !token) return;

    const previewURL = URL.createObjectURL(file);
    setPreviewImage(previewURL);

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}/photo`, {
        method: "POST",
        body: formData,
        headers: authHeaders(),
        credentials: "include",
      });
      const raw = await res.text();
      const data = raw ? JSON.parse(raw) : {};
      if (!res.ok) throw new Error(data?.message || "Error al subir imagen");

      const userRes = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        headers: authHeaders(),
        credentials: "include",
      });
      const fullUser = await userRes.json();
      if (!userRes.ok || !fullUser)
        throw new Error("Error al obtener el usuario actualizado");

      const updatedUser = { ...fullUser, imagen: data.imagen, _updatedAt: Date.now() };
      saveUserToLocalStorage(updatedUser);
      onUserChange?.(updatedUser);
      toast.success("Foto actualizada correctamente");
    } catch (error) {
      console.error("❌ Error en actualización de foto:", error);
      toast.error(error.message || "No se pudo actualizar la foto");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center relative border">
      <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
        <User size={24} />
      </div>

      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <img src={avatarUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
      </div>

      <div className="mt-3 flex gap-3 flex-wrap justify-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <button
          onClick={handleChangePhotoClick}
          className="bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          <Camera size={18} />
          Cambiar foto
        </button>
        <button
          onClick={() =>
            navigate("/olvide-mi-contraseña", {
              state: { email: user.email, fromProfile: true },
            })
          }
          className="bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          Cambiar contraseña
        </button>
      </div>

      <h2 className="mt-4 text-xl font-bold">{user.nombre}</h2>
      <p className="text-sm text-gray-600">{user.email}</p>
    </div>
  );
}

function StatsPanel({ stats, loading }) {
  const cards = useMemo(() => {
    if (!stats) return [];
    return [
      {
        title: "Tiempo de conexión",
        value: `${stats.horas_conectado}h`,
        desc: "Total desde el registro",
        icon: <Clock size={20} />,
        color: "bg-blue-500",
      },
      {
        title: "Accesos",
        value: stats.total_logins,
        desc: "Total de inicios de sesión",
        icon: <LogIn size={20} />,
        color: "bg-green-500",
      },
      {
        title: "Niveles completados",
        value: `${Math.round(stats.niveles_completados)} de 6`,
        desc: "Progreso general",
        icon: <Flag size={20} />,
        color: "bg-yellow-500",
      },
      {
        title: "Unidades completadas",
        value: `${stats.unidades_completadas} de 144`,
        desc: "En el curso actual",
        icon: <BookOpen size={20} />,
        color: "bg-red-500",
      },
    ];
  }, [stats]);

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-6 flex-1 min-h-[300px] border">
      <span className="absolute -top-5 -left-5 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow">
        <BarChart size={28} />
      </span>
      {loading && <p className="text-gray-600">Cargando estadísticas…</p>}
      {!loading && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="relative bg-gray-50 rounded-lg p-4 shadow-md flex flex-col justify-between h-full border"
            >
              <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
              <p className="text-2xl font-bold mt-2 text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.desc}</p>
              <span
                className={`absolute -top-3 -right-3 ${card.color} text-white rounded-full w-10 h-10 flex items-center justify-center shadow`}
              >
                {card.icon}
              </span>
            </div>
          ))}
        </div>
      )}
      {!loading && !stats && (
        <p className="text-sm text-gray-600 mt-2">Sin datos de estadísticas.</p>
      )}
    </div>
  );
}

// Página principal -------------------------------------------------------
export default function ProfileProfesor() {
  const navigate = useNavigate();
  const { user, setUser, refreshUser } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (!user?.id) return;
        const token = getToken();
        if (!token) throw new Error("No hay token. Inicia sesión.");
        setLoadingStats(true);
        const data = await safeFetch(`${API_BASE_URL}/stats/${user.id}`, {
          method: "GET",
          headers: authHeaders(),
        });
        setStats(data?.success ? data : data);
      } catch (err) {
        console.error("❌ Error cargando estadísticas:", err);
        if (err.status === 401)
          toast.error("Sesión expirada. Vuelve a iniciar sesión.");
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    refreshUser();
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

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentLevel={1}
        onLevelChange={() => {}}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-50 bg-gray-50 shadow-md border-b border-gray-300">
          <HeaderProfesor
            user={user}
            handleLogout={handleLogout}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cabecera + datos de profesor */}
          <div className="space-y-4">
            <ProfileHeaderCard user={user} onUserChange={setUser} />

            <div className="bg-white rounded-lg shadow p-4 border text-sm text-gray-700">
              <div className="flex items-center gap-2 mb-2 text-blue-700">
                <Users size={18} />
                <strong>Panel del profesor</strong>
              </div>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <GraduationCap size={16} className="text-gray-500" />
                  <strong>Asignaturas:</strong>{" "}
                  {user.asignaturas?.join?.(", ") ||
                    user.asignatura ||
                    "—"}
                </li>
                <li>
                  <strong>Cursos a cargo:</strong>{" "}
                  {user.cursos?.length ?? user.cursos_count ?? "—"}
                </li>
                <li>
                  <strong>Total de alumnos:</strong>{" "}
                  {user.total_alumnos ?? "—"}
                </li>
                <li>
                  <strong>Último acceso:</strong>{" "}
                  {user.ultimo_acceso
                    ? new Date(user.ultimo_acceso).toLocaleString()
                    : "—"}
                </li>
              </ul>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/docente"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-700"
                >
                  <LayoutDashboard size={16} /> Ver panel docente
                </a>
                <a
                  href="/docente/grupos"
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow hover:bg-blue-600 hover:text-white"
                >
                  <Users size={16} /> Gestionar grupos
                </a>
              </div>
            </div>
          </div>

          <StatsPanel stats={stats} loading={loadingStats} />

          <div className="relative bg-white rounded-lg shadow-lg p-6 flex-1 min-h-[300px] md:col-span-2 border">
            <RechartStats userId={user.id} token={getToken()} />
          </div>
        </div>
      </div>
    </div>
  );
}
