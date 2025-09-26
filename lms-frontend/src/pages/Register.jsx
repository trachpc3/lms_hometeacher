// src/pages/Register.jsx
import { API_BASE_URL } from '../config';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/loog.png";
import { CheckCircle, GraduationCap, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";

const FALLBACK_NIVELES = [
  { id: 1, nombre: "Beginners" },
  { id: 2, nombre: "Lower Intermediate" },
  { id: 3, nombre: "Intermediate" },
  { id: 4, nombre: "Upper Intermediate" },
  { id: 5, nombre: "Advanced" },
  { id: 6, nombre: "Business" },
];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  // Niveles desde API
  const [niveles, setNiveles] = useState(FALLBACK_NIVELES);
  const [nivelId, setNivelId] = useState(FALLBACK_NIVELES[0].id);

  // Datos formulario
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/niveles`, { credentials: "include" });
        const data = await res.json().catch(() => null);

        if (!res.ok || !Array.isArray(data) || data.length === 0) {
          console.warn("⚠️ /niveles no devolvió array válido. Usando fallback.");
          setNiveles(FALLBACK_NIVELES);
          setNivelId(FALLBACK_NIVELES[0].id);
          return;
        }

        setNiveles(data);
        setNivelId(data[0].id);
      } catch (e) {
        console.error("❌ Error cargando niveles:", e);
        setNiveles(FALLBACK_NIVELES);
        setNivelId(FALLBACK_NIVELES[0].id);
      }
    })();
  }, []);

  const validarTelefono = (t) => /^[0-9\s\+\-]{7,15}$/.test(t);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !apellidos || !email || !telefono || !nivelId) {
      return toast.error("Completa todos los campos");
    }
    if (!validarTelefono(telefono)) {
      return toast.error("Número de teléfono inválido");
    }

    // Nombre del nivel seleccionado (para curso_matriculado — compat actual)
    const nivelSel = niveles.find((n) => String(n.id) === String(nivelId));
    const cursoNombre = nivelSel?.nombre || "Beginners";

    try {
      // Registro
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          telefono,
          // Compat con tu backend actual:
          curso_matriculado: cursoNombre,
          // Cuando migres, podrás enviar además:
          // nivel_id: Number(nivelId),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Error al registrarse");

      setRegistroExitoso(true);
      toast.success("Registro exitoso 🎉");

      // Auto-login
      const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: "Hometeacher" }),
      });

      const loginData = await loginRes.json().catch(() => ({}));
      if (!loginRes.ok) throw new Error(loginData.message || "Error al iniciar sesión");

      localStorage.setItem("token", loginData.token);
      login(loginData.user); // Contexto → "Hola {nombre}" al instante

      toast.success("Acceso al campus demo habilitado");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const irACampusDemo = () => navigate("/home");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 pt-6 relative">
        <div className="flex justify-center mb-4">
          <Link to="/"><img src={logo} alt="Logo" className="w-24 sm:w-28" /></Link>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Registro de Demo
        </h2>

        {registroExitoso ? (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4 text-center animate-fade-in">
            <CheckCircle className="text-green-600 w-10 h-10 mx-auto mb-2" />
            <p className="text-green-700 font-semibold">¡Registro exitoso, {nombre}!</p>
            <p className="text-sm text-gray-700 mt-2">
              ✅ Bienvenid@, estás conectad@ como <strong>alumn@ de prueba</strong>.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
              <button
                onClick={irACampusDemo}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                <GraduationCap className="w-4 h-4" /> Entrar al Campus Demo
              </button>
              <Link
                to="/pricing"
                className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                <CreditCard className="w-4 h-4" /> Ver Planes de Pago
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Select de niveles (resiliente) */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Elige tu nivel</label>
            <select
              value={nivelId}
              onChange={(e) => setNivelId(e.target.value)}
              className="w-full p-3 border rounded-md mb-6 focus:ring-2 focus:ring-blue-500"
            >
              {Array.isArray(niveles) && niveles.length > 0 ? (
                niveles.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nombre}
                  </option>
                ))
              ) : (
                <option value="" disabled>Cargando niveles…</option>
              )}
            </select>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
            >
              Crear cuenta demo
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/" className="text-blue-500 hover:underline">Inicia sesión</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
