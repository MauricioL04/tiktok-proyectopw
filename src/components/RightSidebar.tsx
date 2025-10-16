// src/components/RightSidebar.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getActiveUser } from "../utils/storage";
import "./RightSidebar.css";

export default function RightSidebar() {
  const [guestName, setGuestName] = useState("");
  const user = getActiveUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const randomId = Math.floor(Math.random() * 9000) + 1000;
      setGuestName(`guest${randomId}`);
    }
  }, [user]);

  return (
    <aside className="right-sidebar">
      <div className="user-info">
        <span>{user ? user.name : guestName}</span>
        {/* Lógica para mostrar Login o Perfil */}
        {user ? (
          <button onClick={() => navigate("/perfil")} className="login-button">
            Mi Perfil
          </button>
        ) : (
          <button onClick={() => navigate("/login")} className="login-button">
            Iniciar sesión
          </button>
        )}
      </div>
      
      {/* Mensaje que solo aparece si no hay sesión */}
      {!user && (
        <div className="login-prompt">
          <p>Porfavor, inicie sesión para utilizar todas las funciones disponibles.</p>
        </div>
      )}

      <div className="theme-toggle">
        <span>Modo claro</span>
      </div>
    </aside>
  );
}