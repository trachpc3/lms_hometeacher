// src/App.jsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

// Layouts
import Layout from "./layout/Layout";                 // 👈 alumno
import ProfesorLayout from "./layout/ProfesorLayout"; // 👈 profesor (nuevo)

// Páginas
import DashboardProfesor from "./pages/HomeProfesor";
import Alumnos from "./pages/Alumnos";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import TestNivel from "./pages/TestNivel";
import UnitDashboard from "./pages/UnitDashboard";
import Situation from "./pages/Situation";
import Vocabulary from "./pages/Vocabulary";
import Grammar from "./pages/Grammar";
import Practice from "./pages/Practice";
import Listening from "./pages/Listening";
import Writing from "./pages/Writing";
import Assessment from "./pages/Assessment";
import CharacterSelection from "./pages/Speaking";
import ProfilePage from "./pages/ProfilePage";
import Renovaciones from "./pages/Renovaciones";
import FundaeList from "./pages/FundaeList";
import HomeFundae from "./pages/HomeFundae";
import FundaeUsers from "./pages/FundaeUsers";
import ProductiveSkillsPage from "./pages/ProductiveSkills";

// Auth/registro
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import FundaePage from "./pages/FundaePage";

// Mensajes (chat)
import Mensajes from "./pages/Mensajes";

// Placeholder Notificaciones
const Notificaciones = () => (
  <div className="p-6 text-center">
    <h1 className="text-2xl font-bold mb-2">🔔 Notificaciones</h1>
    <p className="text-gray-600">Aquí aparecerán las notificaciones del sistema (en desarrollo).</p>
  </div>
);

// Redirección inteligente para la ruta legacy /mensajes
const MensajesGate = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const rol = user?.rol;
  const to = rol === "profesor" ? "/dashboard-profesor/mensajes" : "/home/mensajes";
  return <Navigate to={to} replace />;
};

const router = createBrowserRouter(
  [
    { path: "/", element: <Login /> },
    { path: "/pricing", element: <Pricing /> },
    { path: "/test-nivel", element: <TestNivel /> },
    { path: "/perfil", element: <ProfilePage /> },

    // Compat /mensajes -> deriva por rol
    { path: "/mensajes", element: <MensajesGate /> },
    { path: "/notificaciones", element: <Notificaciones /> },

    // ===== Alumno (Layout con Header de alumno) =====
    // Asegúrate de que Layout.jsx renderiza <Header /> y un <main> con {children}
    {
      path: "/home",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },            // página principal alumno
        { path: "mensajes", element: <Mensajes /> },   // chat en layout alumno
      ],
    },

    // ===== Profesor (Layout con HeaderProfesor) =====
    {
      path: "/dashboard-profesor",
      element: <ProfesorLayout />,
      children: [
        { index: true, element: <DashboardProfesor /> }, // home del profesor
        { path: "alumnos", element: <Alumnos /> },
        { path: "renovaciones", element: <Renovaciones /> },
        { path: "mensajes", element: <Mensajes /> },     // chat en layout profesor
      ],
    },

    // ===== Fundae (layout propio) =====
    {
      path: "/fundae",
      element: <HomeFundae />,
      children: [
        { index: true, element: <FundaePage /> },
        { path: "envios", element: <FundaeList /> },
        { path: "usuarios", element: <FundaeUsers /> },
      ],
    },

    // ===== Rutas de unidades/actividades =====
    { path: "/unidad/:unitId", element: <UnitDashboard /> },
    { path: "/unidad/:unitId/situation", element: <Situation /> },
    { path: "/unidad/:unitId/vocabulary", element: <Vocabulary /> },
    { path: "/unidad/:unitId/grammar", element: <Grammar /> },
    { path: "/unidad/:unitId/practice", element: <Practice /> },
    { path: "/unidad/:unitId/listening", element: <Listening /> },
    { path: "/unidad/:unitId/writing", element: <Writing /> },
    { path: "/unidad/:unitId/assessment", element: <Assessment /> },
    { path: "/unidad/:unitId/speaking", element: <CharacterSelection /> },
    { path: "/speaking/:actividadId", element: <CharacterSelection /> },
    { path: "/unidad/:unitId/productiveSkills", element: <ProductiveSkillsPage /> },

    // ===== Auth extra =====
    { path: "/olvide-mi-contraseña", element: <ForgotPassword /> },
    { path: "/restablecer-contraseña", element: <ResetPassword /> },
    { path: "/register", element: <Register /> },

    // 404
    {
      path: "*",
      element: (
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">404</h1>
          <p className="text-gray-600">Página no encontrada</p>
        </div>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
