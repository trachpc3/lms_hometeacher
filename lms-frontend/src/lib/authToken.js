let accessToken = null;

export function setAccessToken(t){ accessToken=t; localStorage.setItem('token', t); }
export function getAccessToken(){ return accessToken ?? (accessToken = localStorage.getItem('token')); }
export function clearAccessToken(){ accessToken=null; localStorage.removeItem('token'); }
