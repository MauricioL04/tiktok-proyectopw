import { Link, NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Mensajes from "./pages/Mensajes";
import Register from "./pages/Register";
import {
  getActiveUser,
  clearActiveUser,
} from "./utils/storage";

export default function App() {
  const [user, setUser] = useState(getActiveUser());
  const navigate = useNavigate();

  useEffect(() => {
    const onUserChanged = () => setUser(getActiveUser());
    window.addEventListener("userChanged", onUserChanged);
    return () => window.removeEventListener("userChanged", onUserChanged);
  }, []);

  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: 12,
          padding: 12,
          borderBottom: "1px solid #2b2b2b",
          alignItems: "center",
        }}
      >
        <Link to="/" style={{ fontWeight: 700 }}>
          TikTok–UL
        </Link>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/mensajes">Mensajes</NavLink>
        <NavLink to="/perfil">Perfil</NavLink>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          {user ? (
            <>
              <span>
                {user.name} · 💰{user.coins}
              </span>
              <button
                onClick={() => {
                  clearActiveUser();
                  window.dispatchEvent(new CustomEvent("userChanged"));
                  navigate("/login");
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </div>
      </nav>

      <main style={{ padding: 16 }}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/mensajes" element={<Mensajes />} />
        </Routes>
      </main>
    </div>
  );
}
