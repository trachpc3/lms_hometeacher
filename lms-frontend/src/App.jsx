// src/App.jsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

// Layouts
import Layout from "@/layouts/Layout";
import ProfesorLayout from "@/layouts/ProfesorLayout";

// Páginas (contenido)
import HomeContent from "../pages/HomeContent";          // 👈 NUEVO: solo contenido del curso
import DashboardProfesor from "./pages/HomeProfesor";
import Alumnos from "./pages/Alumnos";
import Login from "./pages/Login";
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

// Redirección inteligente para /mensajes según rol
const MensajesGate = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const rol = user?.rol;
  const to = rol === "profesor" ? "/dashboard-profesor/mensajes" : "/home/mensajes";
  return <Navigate to={to} replace />;
};

const router = createBrowserRouter(
  [
    // Públicas
    { path: "/", element: <Login /> },
    { path: "/pricing", element: <Pricing /> },
    { path: "/test-nivel", element: <TestNivel /> },
    { path: "/perfil", element: <ProfilePage /> },

    // Rutas comunes
    { path: "/mensajes", element: <MensajesGate /> },
    { path: "/notificaciones", element: <Notificaciones /> },

    // ===== Alumno (usa Layout de src/layouts) =====
    {
      path: "/home",
      element: <Layout />,                       // pinta Header + Sidebar de alumno
      children: [
        { index: true, element: <HomeContent /> },   // 👈 solo el contenido, sin duplicar layout
        { path: "mensajes", element: <Mensajes /> },
      ],
    },

    // ===== Profesor (usa ProfesorLayout) =====
    {
      path: "/dashboard-profesor",
      element: <ProfesorLayout />,              // pinta Header + Sidebar de profesor
      children: [
        { index: true, element: <DashboardProfesor /> },
        { path: "alumnos", element: <Alumnos /> },
        { path: "renovaciones", element: <Renovaciones /> },
        { path: "mensajes", element: <Mensajes /> },
        { path: "curso", element: <HomeContent /> },  // 👈 profesor “Entrar al curso” sin duplicar layout
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

    // ===== Unidades/actividades =====
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
