// src/components/HeaderUser.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveUser, clearActiveUser } from "../utils/storage";
import "./HeaderUser.css"; // Importamos el nuevo archivo CSS

export default function HeaderUser() {
  const [user, setUser] = useState(getActiveUser());
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserChange = () => setUser(getActiveUser());
    window.addEventListener("userChanged", handleUserChange);
    return () => window.removeEventListener("userChanged", handleUserChange);
  }, []);

  const logout = () => {
    clearActiveUser();
    window.dispatchEvent(new CustomEvent("userChanged"));
    navigate("/login");
  };

  return (
    <div className="header-user-container">
      {user ? (
        <div className="header-user-profile">
          <div className="header-user-avatar">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="avatar" />
          </div>
          <div className="header-user-info">
            <div className="header-user-name">{user.name}</div>
            <div className="header-user-details">
              Saldo: <span className="user-coins">{user.coins}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="header-user-guest">
          No has iniciado sesión.
        </div>
      )}
    </div>
  );
}