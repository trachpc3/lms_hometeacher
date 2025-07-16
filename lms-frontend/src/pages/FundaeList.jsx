import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { obtenerEnviosFundae } from "../services/fundaeService";


export default function FundaeList() {
  const [envios, setEnvios] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
     obtenerEnviosFundae().then((res) => {
      if (res.success) setEnvios(res.data);
    });
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredEnvios.map((e) => ({
        ID: e.id,
        Nombre: e.nombre,
        DNI: e.dni,
        Curso: e.curso_id,
        Estado: e.estado ? "OK" : "ERROR",
        Fecha: new Date(e.fecha).toLocaleString(),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "EnviosFUNDAE");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `EnviosFUNDAE_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const filteredEnvios = envios.filter(
    (e) =>
      e.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      e.dni.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          📋 Envíos a FUNDAE
        </h2>
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          📥 Exportar a Excel
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o DNI..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-4 w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200 text-left">
            <tr>
              {["ID", "Nombre", "DNI", "Curso", "Estado", "Fecha"].map(
                (head) => (
                  <th key={head} className="px-4 py-2 border">
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredEnvios.map((e, idx) => (
              <tr
                key={e.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border px-4 py-2">{e.id}</td>
                <td className="border px-4 py-2">{e.nombre}</td>
                <td className="border px-4 py-2">{e.dni}</td>
                <td className="border px-4 py-2">{e.curso_id}</td>
                <td className="border px-4 py-2 text-green-700 font-semibold">
                  OK #{e.id}
                </td>
                <td className="border px-4 py-2">
                  {new Date(e.fecha).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEnvios.length === 0 && (
          <p className="text-gray-500 text-center mt-4">Sin resultados.</p>
        )}
      </div>
    </div>
  );
}
