export async function resolveCursoId(pool, { curso_id, curso_nombre }) {
  // Si ya viene curso_id, úsalo
  if (curso_id) return Number(curso_id);

  // Si viene nombre, lo buscamos/creamos
  const nombre = (curso_nombre || "").trim();
  if (!nombre) return null;

  const [found] = await pool.query(
    "SELECT id FROM cursos WHERE nombre = ? LIMIT 1",
    [nombre]
  );
  if (found.length) return found[0].id;

  const [ins] = await pool.query(
    "INSERT INTO cursos (nombre) VALUES (?)",
    [nombre]
  );
  return ins.insertId;
}
