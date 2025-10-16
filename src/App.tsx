import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HeaderUser from "./components/HeaderUser";
import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";
import TyC from "./pages/TyC";
import Login from "./pages/Login";
import "./App.css";

export default function App() {
  return (
    <div className="app-root">
      <Sidebar />                     {/* FIXED left column */}
      <div className="main-wrapper">
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/tyc" element={<TyC />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <aside className="right-panel">
          <HeaderUser />               {/* FIXED right column visual */}
        </aside>
      </div>
    </div>
  );
}
