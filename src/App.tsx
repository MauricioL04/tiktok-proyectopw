// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar"; // <-- ¡Importamos el nuevo componente!
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Nosotros from "./pages/Nosotros";
import TyC from "./pages/TyC";
import "./App.css";

// Un componente para el layout principal que usan la mayoría de las páginas
function MainLayout() {
  return (
    <div className="app-grid-container">
      <Sidebar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/tyc" element={<TyC />} />
          {/* Aquí irán las otras páginas como Perfil, Explorar, etc. */}
        </Routes>
      </main>
      <RightSidebar /> {/* <-- ¡Añadimos la nueva barra derecha! */}
    </div>
  );
}

// El componente principal que gestiona qué layout mostrar
export default function App() {
  return (
    <Routes>
      {/* Rutas que NO usan el layout principal */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Todas las demás rutas usarán el MainLayout */}
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
}