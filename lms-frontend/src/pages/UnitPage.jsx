import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUnidadById } from "../api";

function UnitPage() {
  const { id } = useParams(); // Obtener el ID de la unidad desde la URL
  const [unidad, setUnidad] = useState(null);

  useEffect(() => {
    async function fetchUnidad() {
      try {
        const data = await getUnidadById(id);
        setUnidad(data);
      } catch (error) {
        console.error("Error al obtener la unidad:", error);
      }
    }
    fetchUnidad();
  }, [id]);

  if (!unidad) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{unidad.titulo}</h1>
      <p>{unidad.descripcion}</p>
      <h2>Lecciones</h2>
      <ul>
        {unidad.lecciones.map((leccion) => (
          <li key={leccion.id}>{leccion.titulo}</li>
        ))}
      </ul>
    </div>
  );
}

export default UnitPage;
