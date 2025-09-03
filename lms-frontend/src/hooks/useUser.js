export const getUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  const user = JSON.parse(storedUser);
  let imagen = user.imagen || "default-profile.jpg";

  if (
    imagen !== "default-profile.jpg" &&
    !imagen.startsWith("/uploads/avatars/") &&
    !imagen.startsWith("http")
  ) {
    imagen = `/uploads/avatars/${imagen}`;
  }

  return {
    ...user,
    imagen,
    estado: user.estado || "",
  };
};


export const saveUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearUserFromLocalStorage = () => {
  localStorage.removeItem("user");
};
