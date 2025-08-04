import { API_BASE_URL } from '../config';
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/loog.png";

const ForgotPassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const desdePerfil = location.state?.fromProfile;

  useEffect(() => {
    const stateEmail = location.state?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al enviar enlace");

      setMensaje(
        desdePerfil
          ? "🔐 Te enviamos un enlace para cambiar tu contraseña"
          : "📧 Revisa tu correo. Se envió un enlace de recuperación."
      );
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative flex items-center justify-center px-4">
      {/* LOGO */}
      <Link to="/" className="absolute top-6 left-6">
        <img src={logo} alt="Logo" className="w-28" />
      </Link>

      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {desdePerfil ? "Cambiar contraseña" : "¿Olvidaste tu contraseña?"}
        </h2>

        {mensaje && <p className="text-green-600 text-sm mb-4">{mensaje}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
            required
            readOnly={desdePerfil}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
          >
            {desdePerfil ? "Enviar enlace de cambio" : "Enviar enlace de recuperación"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/" className="text-blue-500 hover:underline text-sm">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
