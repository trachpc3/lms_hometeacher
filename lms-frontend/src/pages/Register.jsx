import { API_BASE_URL } from "../config";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/loog.png";
import { CheckCircle, GraduationCap, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [niveles, setNiveles] = useState([]);   // 👈 viene de la BD
  const [nivelId, setNivelId] = useState("");   // 👈 seleccion actual

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  // ✅ Cargar niveles desde el backend al montar
  useEffect(() => {
    fetch(`${API_BASE_URL}/niveles`)
      .then((res) => res.json())
      .then((data) => {
        setNiveles(data);
        if (data.length > 0) setNivelId(data[0].id); // preseleccionar el primero
      })
      .catch((err) => {
        console.error("Error cargando niveles:", err);
        toast.error("No se pudieron cargar los niveles");
      });
  }, []);

  const validarTelefono = (telefono) => /^[0-9\s\+\-]{7,15}$/.test(telefono);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !apellidos || !email || !telefono || !nivelId) {
      return toast.error("Completa todos los campos");
    }

    if (!validarTelefono(telefono)) {
      return toast.error("Número de teléfono inválido");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          telefono,
          nivel_id: nivelId,   // 👈 en vez de curso_matriculado
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrarse");

      setRegistroExitoso(true);
      toast.success("Registro exitoso 🎉");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 pt-6 relative">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-24 sm:w-28" />
          </Link>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Registro de Demo
        </h2>

        {!registroExitoso ? (
          <form onSubmit={handleSubmit}>
            {/* ...inputs nombre, apellidos, email, telefono... */}

            {/* ✅ Select dinámico desde BD */}
            <select
              value={nivelId}
              onChange={(e) => setNivelId(e.target.value)}
              className="w-full p-3 border rounded-md mb-6 focus:ring-2 focus:ring-blue-500"
            >
              {niveles.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nombre}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
            >
              Crear cuenta demo
            </button>
          </form>
        ) : (
          <p>✅ Registro exitoso...</p>
        )}
      </div>
    </div>
  );
};

export default Register;
