import { useEffect, useState } from "react";
import { obtenerFundaeUsers } from "../services/fundaeService";

export default function FundaeUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    obtenerFundaeUsers()
      .then(setUsuarios)
      .catch(err => console.error("❌ Error cargando usuarios Fundae:", err));
  }, []);

  const listaFiltrada = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email.toLowerCase().includes(filtro.toLowerCase()) ||
    (u.telefono || "").includes(filtro)
  );

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Usuarios de gestión Fundæ</h2>

      <input
        type="text"
        placeholder="Buscar por nombre, email o teléfono..."
        className="w-full mb-4 p-2 border rounded"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />

      <table className="min-w-full table-auto border-collapse">
        <thead><tr className="bg-gray-200">
          {["ID", "Nombre", "Email", "Teléfono", "Estado", "Fecha alta"].map(h => (
            <th key={h} className="border px-4 py-2">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {listaFiltrada.map((u, i) => (
            <tr key={u.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border px-4 py-2">{u.id}</td>
              <td className="border px-4 py-2">{u.nombre}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.telefono || "-"}</td>
              <td className="border px-4 py-2">{u.estado}</td>
              <td className="border px-4 py-2">{new Date(u.fecha_registro).toLocaleDateString()}</td>
            </tr>
          ))}
          {listaFiltrada.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No se encontraron usuarios.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
