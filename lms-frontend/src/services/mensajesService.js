export async function getUnreadCount() {
  const res = await fetch('/api/mensajes/unread-count', { credentials: 'include' });
  if (!res.ok) throw new Error('No se pudo obtener el conteo de no leídos');
  return res.json(); // { unread: number }
}
