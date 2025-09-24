import { API_BASE_URL } from "../config";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LogIn, Clock, Camera, User, Flag, BookOpen, BarChart, Menu } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CountdownBanner from "../components/ui/CountdownBanner";
import RechartStats from "../components/charts/RechartStats";
import { getAvatarUrl } from "../utils/getAvatarUrl";
import { saveUserToLocalStorage } from "../hooks/useUser";
import { useUser } from "../context/UserContext";

const getToken = () => localStorage.getItem("token") || localStorage.getItem("accessToken");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

const safeFetch = async (url, opts = {}) => {
  const res = await fetch(url, { credentials: "include", ...opts });
  const raw = await res.text();
  const contentType = res.headers.get("content-type") || "";

  let data;
  try {
    data = contentType.includes("application/json") && raw ? JSON.parse(raw) : raw;
  } catch {
    data = raw;
  }

  if (!res.ok) {
    const msg = (typeof data === "string" ? data : data?.error || data?.message) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { user: loggedInUser, setUser: setLoggedInUser, refreshUser } = useUser();

  const [user, setUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isOwnProfile = !id;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("Token no encontrado");

        const userId = id || loggedInUser?.id;
        if (!userId) throw new Error("ID de usuario no válido");

        const data = await safeFetch(`${API_BASE_URL}/users/${userId}`, {
          headers: authHeaders(),
        });

        setUser(data);

        if (isOwnProfile) {
          saveUserToLocalStorage(data);
          setLoggedInUser(data);
        }
      } catch (err) {
        console.error("Error cargando perfil:", err);
        toast.error(err.message || "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, loggedInUser?.id]);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) return;
      try {
        setLoadingStats(true);
        const data = await safeFetch(`${API_BASE_URL}/stats/${user.id}`, {
          headers: authHeaders(),
        });
        setStats(data);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
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

  const handleChangePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    const token = getToken();
    if (!file || !token) return;

    setPreviewImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}/photo`, {
        method: "POST",
        body: formData,
        headers: authHeaders(),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error al subir imagen");

      const updated = { ...user, imagen: data.imagen };
      setUser(updated);
      if (isOwnProfile) {
        saveUserToLocalStorage(updated);
        setLoggedInUser(updated);
      }

      toast.success("Foto actualizada correctamente");
    } catch (error) {
      toast.error(error.message || "No se pudo actualizar la foto");
    }
  };

  if (loading) return <div className="p-6">Cargando perfil…</div>;
  if (!user) return <div className="p-6 text-red-600">❌ Perfil no encontrado</div>;

  const statsCards = stats
    ? [
        { title: "Tiempo de conexión", value: `${stats.horas_conectado}h`, desc: "Total desde el registro", icon: <Clock size={20} />, color: "bg-blue-500" },
        { title: "Accesos", value: stats.total_logins, desc: "Total de inicios de sesión", icon: <LogIn size={20} />, color: "bg-green-500" },
        { title: "Niveles completados", value: `${Math.round(stats.niveles_completados)} de 6`, desc: "Progreso general", icon: <Flag size={20} />, color: "bg-yellow-500" },
        { title: "Unidades completadas", value: `${stats.unidades_completadas} de 144`, desc: "En el curso actual", icon: <BookOpen size={20} />, color: "bg-red-500" },
      ]
    : [];

  return (
    <div className="flex h-screen overflow-hidden relative">
      <button className="absolute top-4 left-4 z-50 bg-white border border-gray-300 rounded-md p-2 md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <Menu size={24} />
      </button>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} currentLevel={1} onLevelChange={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-50 bg-gray-50 shadow-md border-b border-gray-300">
          <Header key={user._updatedAt || user.imagen} startTutorial={() => {}} handleLogout={handleLogout} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.estado_formacion === "demo" && user.fecha_registro && (
            <div className="md:col-span-2">
              <CountdownBanner startTime={user.fecha_registro} />
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center relative border">
            <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
              <User size={24} />
            </div>

            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={
                  previewImage ||
                  getAvatarUrl(
                    user.imagen?.startsWith("/uploads/") ? user.imagen.split("/").pop() : user.imagen
                  )
                }
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-3 flex gap-3 flex-wrap justify-center">
              {isOwnProfile && (
                <>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <button onClick={handleChangePhotoClick} className="bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow">
                    <Camera size={18} /> Cambiar foto
                  </button>
                  <button
                    onClick={() => navigate("/olvide-mi-contraseña", { state: { email: user.email, fromProfile: true } })}
                    className="bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg flex items-center gap-2 shadow"
                  >
                    Cambiar contraseña
                  </button>
                </>
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold">{user.nombre}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>

            <div className="mt-3 text-gray-700 text-sm flex justify-center items-center gap-3 flex-wrap">
              <p><strong>Curso:</strong> {user.curso}</p>
              <span className="text-gray-400">|</span>
              <p><strong>Profesor:</strong> {user.profesor}</p>
              <span className="text-gray-400">|</span>
              <p><strong>Móvil:</strong> {user.telefono || user.movil}</p>
            </div>
          </div>

          <div className="relative bg-white rounded-lg shadow-lg p-6 flex-1 min-h-[300px] border">
            <span className="absolute -top-5 -left-5 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow">
              <BarChart size={28} />
            </span>

            {loadingStats && <p className="text-gray-600">Cargando estadísticas…</p>}

            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                {statsCards.map((card, index) => (
                  <div key={index} className="relative bg-gray-50 rounded-lg p-4 shadow-md flex flex-col justify-between h-full border">
                    <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
                    <p className="text-2xl font-bold mt-2 text-gray-900">{card.value}</p>
                    <p className="text-sm text-gray-500">{card.desc}</p>
                    <span className={`absolute -top-3 -right-3 ${card.color} text-white rounded-full w-10 h-10 flex items-center justify-center shadow`}>
                      {card.icon}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {!loadingStats && !stats && (
              <p className="text-sm text-gray-600 mt-2">Sin datos de estadísticas.</p>
            )}
          </div>

          <div className="relative bg-white rounded-lg shadow-lg p-6 flex-1 min-h-[300px] md:col-span-2 border">
            <RechartStats userId={user.id} token={getToken()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
