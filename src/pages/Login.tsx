// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  verifyCredentials,
  getActiveUser,
  setActiveUser,
  clearActiveUser,
} from "../utils/storage";
import "./Login.css";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const active = getActiveUser();
    if (active) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const blocked = localStorage.getItem("pw_block_until");
    if (blocked) {
      const time = parseInt(blocked);
      if (Date.now() < time) setBlockedUntil(time);
      else localStorage.removeItem("pw_block_until");
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (blockedUntil && Date.now() < blockedUntil) {
      const remaining = Math.ceil((blockedUntil - Date.now()) / 1000);
      setError(`Cuenta bloqueada. Intenta nuevamente en ${remaining}s`);
      return;
    }

    const user = verifyCredentials(identifier.trim(), password);

    if (!user) {
      const attempts = parseInt(localStorage.getItem("pw_login_attempts") || "0") + 1;
      localStorage.setItem("pw_login_attempts", attempts.toString());

      if (attempts >= 3) {
        const blockTime = Date.now() + 30 * 1000;
        localStorage.setItem("pw_block_until", blockTime.toString());
        setBlockedUntil(blockTime);
        localStorage.removeItem("pw_login_attempts");
        setError("Demasiados intentos fallidos. Bloqueado por 30s.");
      } else {
        setError(`Usuario o contraseña inválidos (${3 - attempts} intentos restantes)`);
      }
      return;
    }

    localStorage.removeItem("pw_login_attempts");
    localStorage.removeItem("pw_block_until");
    setBlockedUntil(null);

    if (remember) {
      setActiveUser(user);
    } else {
      sessionStorage.setItem("pw_active_user", JSON.stringify(user));
      clearActiveUser();
    }

    window.dispatchEvent(new CustomEvent("userChanged"));
    navigate("/");
  };

  const getRemaining = () => {
    if (!blockedUntil) return 0;
    const remaining = Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000));
    if (remaining === 0) {
      localStorage.removeItem("pw_block_until");
      setBlockedUntil(null);
    }
    return remaining;
  };

  return (
    <div className="login-container">
      <form onSubmit={onSubmit} className="login-form">
        <h2>Iniciar sesión</h2>

        <label>Correo o usuario</label>
        <input
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="usuario o correo"
          disabled={blockedUntil !== null && Date.now() < blockedUntil}
        />

        <label>Contraseña</label>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            required
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            disabled={blockedUntil !== null && Date.now() < blockedUntil}
            style={{
              flex: 1,
              paddingRight: "2.2rem", // espacio justo para el ojo
              boxSizing: "border-box",
            }}
          />
          <span
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: "0.6rem",
              cursor: "pointer",
              opacity: 0.8,
              fontSize: "1.1rem",
              userSelect: "none",
            }}
          >
            {showPass ? "🙈" : "👁️"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            id="rememberMe"
          />
          <label htmlFor="rememberMe">Recordar sesión</label>
        </div>

        <button
          type="submit"
          disabled={blockedUntil !== null && Date.now() < blockedUntil}
        >
          Entrar
        </button>

        {blockedUntil && Date.now() < blockedUntil && (
          <div style={{ color: "orange", marginTop: 8 }}>
            Espera {getRemaining()} segundos para volver a intentar.
          </div>
        )}

        {error && <div style={{ color: "salmon", marginTop: 8 }}>{error}</div>}

        <p style={{ marginTop: 12 }}>
          ¿No tienes cuenta?{" "}
          <span
            style={{ color: "#ff0050", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Registrarse
          </span>
        </p>
      </form>
    </div>
  );
}
