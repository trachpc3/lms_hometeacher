import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export default function FundaeAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/fundae`);
        const data = await response.json();
        if (data.success) {
          setAlumnos(data.data);
        }
      } catch (error) {
        console.error("Error cargando alumnos fundae:", error);
      }
    };

    fetchAlumnos();
  }, []);

  const alumnosFiltrados = alumnos.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">👥 Alumnos con acceso a FUNDAE</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        className="w-full mb-4 p-2 border rounded"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Teléfono</th>
            <th className="border px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {alumnosFiltrados.map((a, idx) => (
            <tr key={a.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border px-4 py-2">{a.id}</td>
              <td className="border px-4 py-2">{a.nombre}</td>
              <td className="border px-4 py-2">{a.email}</td>
              <td className="border px-4 py-2">{a.telefono || "—"}</td>
              <td className="border px-4 py-2">{a.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
