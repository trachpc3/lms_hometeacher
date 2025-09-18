// src/services/searchService.js
export async function searchAlumnos({ q = "", page = 1, limit = 10 } = {}) {
  const usp = new URLSearchParams();
  if (q) usp.set("q", q);
  usp.set("page", page);
  usp.set("limit", limit);
  const res = await fetch(`/api/alumnos?${usp.toString()}`, { credentials: "include" });
  if (!res.ok) throw new Error("No se pudieron cargar alumnos");
  return res.json(); // { alumnos, total, page, pages }
}
