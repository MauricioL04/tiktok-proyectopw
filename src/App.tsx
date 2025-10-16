// src/App.tsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Nosotros from "./pages/Nosotros";
import TyC from "./pages/TyC";
import ForgotPassword from "./pages/ForgotPassword";
import LevelsPage from "./pages/LevelsPage";
import StatsPage from "./pages/StatsPage";
import StreamSetupPage from "./pages/StreamSetupPage"; // Importa la nueva página
import { FaBars } from "react-icons/fa";
import "./App.css";

function MainLayout() {
  const [isRightSidebarVisible, setRightSidebarVisible] = useState(true);

  const toggleRightSidebar = () => {
    setRightSidebarVisible(!isRightSidebarVisible);
  };

  return (
    <div className={`app-grid-container ${isRightSidebarVisible ? '' : 'collapsed'}`}>
      <Sidebar />
      <main className="page-content">
        <button 
          onClick={toggleRightSidebar} 
          className="sidebar-toggle-button"
          style={{ right: isRightSidebarVisible ? '300px' : '20px' }}
        >
          <FaBars />
        </button>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/tyc" element={<TyC />} />
          <Route path="/levels" element={<LevelsPage />} />
          <Route path="/estadisticas" element={<StatsPage />} />
          <Route path="/stream/setup" element={<StreamSetupPage />} /> {/* Añade la nueva ruta */}
        </Routes>
      </main>
      {isRightSidebarVisible && <RightSidebar />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
}