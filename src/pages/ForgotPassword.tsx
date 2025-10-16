// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Reutilizamos los estilos del login para mantener la consistencia

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Estado para controlar qué vista mostrar

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En una app real, aquí se llamaría al backend para enviar el correo.
    // Nosotros solo simularemos el éxito.
    setIsSubmitted(true);
  };

  return (
    <div className="login-container">
      {isSubmitted ? (
        // --- VISTA #2: MENSAJE DE CONFIRMACIÓN ---
        <div className="login-form">
          <h2 className="text-center mb-4">🎬 Streaming–UL</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            Se ha enviado un enlace para restaurar tu contraseña al correo/teléfono con el que te registraste.
          </p>
          <button 
            type="button" 
            className="submit-button" 
            onClick={() => navigate("/login")}
            style={{ marginTop: '1rem' }}
          >
            Regresar al inicio de sesión
          </button>
        </div>
      ) : (
        // --- VISTA #1: FORMULARIO INICIAL ---
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Recuperar Cuenta</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Ingresa tu correo o teléfono para enviarte un enlace de recuperación.
          </p>

          <label>Correo o teléfono</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo o teléfono"
            required
          />

          <button type="submit" className="submit-button">
            Enviar enlace
          </button>

          <button 
            type="button" 
            className="back-to-home-button" 
            onClick={() => navigate("/login")}
          >
            Cancelar y volver
          </button>
        </form>
      )}
    </div>
  );
}