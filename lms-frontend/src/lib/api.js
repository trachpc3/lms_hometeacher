// src/lib/api.js
import { API_BASE_URL } from "../config";
import { getAccessToken } from "./authToken";

const authHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

async function safeFetch(url, opts = {}) {
  const res = await fetch(url, { credentials: "include", ...opts });
  const raw = await res.text();
  let data;
  try {
    data = raw && res.headers.get("content-type")?.includes("json") ? JSON.parse(raw) : raw;
  } catch {
    data = raw;
  }

  if (!res.ok) {
    const err = new Error(data?.message || `Error HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  get: (path, opts = {}) =>
    safeFetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: { ...authHeaders(), ...(opts.headers || {}) },
      ...opts,
    }),

  post: (path, body, opts = {}) =>
    safeFetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(), ...(opts.headers || {}) },
      body: JSON.stringify(body),
      ...opts,
    }),

  put: (path, body, opts = {}) =>
    safeFetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders(), ...(opts.headers || {}) },
      body: JSON.stringify(body),
      ...opts,
    }),

  del: (path, opts = {}) =>
    safeFetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers: { ...authHeaders(), ...(opts.headers || {}) },
      ...opts,
    }),
};
