// src/services/searchService.js
import { api } from "../lib/api";

export function searchAlumnos({ q = "", page = 1, limit = 10 } = {}) {
  const usp = new URLSearchParams();
  if (q) usp.set("q", q);
  usp.set("page", page);
  usp.set("limit", limit);
  return api.get(`/alumnos?${usp.toString()}`);
}
