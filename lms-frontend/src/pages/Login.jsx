import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL, GOOGLE_CLIENT_ID } from "../config";
import logo from "../assets/loog.png";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const { token, user } = await response.json();

      const imagenNormalizada = !user.imagen || user.imagen === "/default-profile.png"
        ? "default-profile.jpg"
        : user.imagen.replace("/uploads/", "").replace(/^\//, "");

      const usuarioLimpio = {
        ...user,
        imagen: imagenNormalizada,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuarioLimpio));
      toast.success("Inicio de sesión exitoso");

      if (user.rol === "fundae") {
  navigate("/fundae");
} else if (user.rol === "gestion") {
  navigate("/fundae/envios");
} else if (user.rol === "profesor") {
  navigate("/dashboard-profesor");
} else {
  navigate("/home");
}

    } catch (err) {
      console.error("❌ Error login:", err);
      toast.error(err.message || "Error al iniciar sesión");
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
        body: JSON.stringify({ access_token: response.credential }),
      });

      if (!res.ok) throw new Error("Error al iniciar sesión con Google");

      const { token, user } = await res.json();

      const imagenNormalizada = !user.imagen || user.imagen === "/default-profile.png"
        ? "default-profile.jpg"
        : user.imagen.replace("/uploads/", "").replace(/^\//, "");

      const usuarioLimpio = {
        ...user,
        imagen: imagenNormalizada,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuarioLimpio));
      toast.success("Sesión iniciada con Google");

         if (user.rol === "fundae") {
  navigate("/fundae/envios");
} else if (user.rol === "gestion") {
  navigate("/fundae");
} else if (user.rol === "profesor") {
  navigate("/dashboard-profesor");
} else {
  navigate("/home");
}
    } catch (error) {
      console.error("❌ Login Google fallido:", error);
      toast.error(error.message || "Error al iniciar sesión con Google");
    }
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
      <div
        className="hidden md:flex w-2/3 h-full bg-cover bg-center items-center px-20"
        style={{ backgroundImage: "url('/landing1.jpg')" }}
      >
        <h1 className="text-white text-5xl font-bold leading-tight">
          Bienvenido a <br /> HomeTeacher <br />
          tu academia de inglés online.
        </h1>
      </div>

      <div className="w-full md:w-1/3 h-full flex flex-col justify-center items-center bg-white shadow-lg px-10">
        <img src={logo} alt="Logo" className="w-32 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-800">Entra en tu Campus</h2>

        <form onSubmit={handleLogin} className="mt-6 w-full max-w-xs">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
          >
            INICIAR SESIÓN
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
