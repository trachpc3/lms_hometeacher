import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // ✅ Importa el contexto

// Importa las páginas de tu aplicación

import DashboardProfesor from "./pages/HomeProfesor";
import Alumnos from "./pages/Alumnos";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
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


// 🆕 Recuperación de contraseña
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import FundaePage from "./pages/FundaePage";

const router = createBrowserRouter(
  [
    { path: "/", element: <Login /> },
    { path: "/home", element: <Home /> },
    { path: "/pricing", element: <Pricing /> },
    { path: "/perfil", element: <ProfilePage /> },

    {
    path: "/dashboard-profesor",
    element: <DashboardProfesor />,
    children: [
      { path: "alumnos", element: <Alumnos /> },
      { path: "renovaciones", element: <Renovaciones /> },
    ],
  },
   
    // 🆕 Rutas para recuperación de contraseña
    { path: "/olvide-mi-contraseña", element: <ForgotPassword /> },
    { path: "/restablecer-contraseña", element: <ResetPassword /> },
    { path: "/register", element: <Register /> },

    {
       path: "/fundae",
  element: <HomeFundae />,
  children: [
    { index: true, element: <FundaePage /> },        // 👉 Muestra el formulario al acceder a /fundae
    { path: "envios", element: <FundaeList /> },      // 👉 Muestra el listado en /fundae/envios
    { path: "usuarios", element: <FundaeUsers /> }
  ],
    },


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
    { path: "/unidad/:unitId/productiveSkills", element: <ProductiveSkillsPage /> }


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
