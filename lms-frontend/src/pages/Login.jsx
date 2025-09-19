import { GOOGLE_CLIENT_ID } from "../config";
import { API_BASE_URL } from "../config";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/loog.png";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useUser } from "@/context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      toast.error("Correo no válido");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const { token, user } = await response.json();
      procesarUsuario(token, user);
      toast.success("Inicio de sesión exitoso");
      redirigirSegunRol(user.rol);
    } catch (err) {
      console.error("❌ Error login:", err);
      toast.error(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      toast.error("SDK de Google no cargado aún.");
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ access_token: response.credential }),
      });

      if (!res.ok) throw new Error("Error al iniciar sesión con Google");

      const { token, user } = await res.json();
      procesarUsuario(token, user);
      toast.success("Sesión iniciada con Google");
      redirigirSegunRol(user.rol);
    } catch (error) {
      console.error("❌ Login Google fallido:", error);
      toast.error(error.message || "Error al iniciar sesión con Google");
    }
  };

  const procesarUsuario = (token, user) => {
    const usuarioLimpio = {
      ...user,
      imagen: user.imagen || null, // ✅ DEJAMOS QUE EL HELPER DECIDA
    };

    localStorage.setItem("token", token);
    login(usuarioLimpio);
  };

  const redirigirSegunRol = (rol) => {
    const rutasPorRol = {
      fundae: "/fundae/envios",
      gestion: "/fundae",
      profesor: "/dashboard-profesor",
      default: "/home",
    };

    navigate(rutasPorRol[rol] || rutasPorRol.default);
  };

  useEffect(() => {
    if (window.google && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Imagen lateral con texto centrado abajo */}
      <div
        className="hidden md:flex w-2/3 h-full bg-cover bg-center relative"
        style={{ backgroundImage: "url('/landing1.jpg')" }}
      >
        <div className="absolute bottom-12 left-0 w-full text-center px-6">
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">
            Bienvenido a HomeTeacher <br />
            Tu academia de inglés online
          </h1>
        </div>
      </div>

      {/* Formulario de login */}
      <div className="w-full md:w-1/3 h-full flex flex-col justify-center items-center bg-white shadow-lg px-10">
        <img src={logo} alt="Logo" className="w-32 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-800">Entra en tu Campus</h2>

        <form onSubmit={handleLogin} className="mt-6 w-full max-w-xs">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-3 rounded-md transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Iniciando..." : "INICIAR SESIÓN"}
          </button>

          <div className="text-center text-gray-600 my-4">o inicia sesión con</div>

          <div className="flex justify-center gap-4">
            <SocialLoginButton icon={FaGoogle} color="bg-red-500" onClick={handleGoogleLogin} />
            <SocialLoginButton
              icon={FaFacebook}
              color="bg-blue-600"
              onClick={() => toast("Login con Facebook aún no implementado")}
            />
          </div>

          <div className="text-center text-gray-500 text-sm mt-4">
            <p>
              Al registrarme declaro que he leído y acepto los{" "}
              <Link to="#" className="text-blue-500 hover:underline">
                Términos y condiciones
              </Link>.
            </p>
            <Link
              to="/olvide-mi-contraseña"
              className="text-blue-500 hover:underline block mt-2"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

        <p className="text-gray-600 text-sm mt-4">
          ¿Eres nuevo?{" "}
          <Link to="/register" className="text-orange-500 font-semibold hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
};

const SocialLoginButton = ({ icon: Icon, color, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`${color} text-white p-3 rounded-full hover:opacity-80 transition`}
  >
    <Icon size={20} />
  </button>
);

export default Login;
