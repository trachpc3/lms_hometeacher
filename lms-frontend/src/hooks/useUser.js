export const getUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  const user = JSON.parse(storedUser);

  return {
    ...user,
    imagen: user.imagen || null, // 👈 dejar que el helper decida si usar default
    estado: user.estado || "",
  };
};

export const saveUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearUserFromLocalStorage = () => {
  localStorage.removeItem("user");
};
