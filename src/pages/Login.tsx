import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Role } from '../utils/storage';
import { saveUser } from '../utils/storage';
import './Login.css'; // ← Importamos los estilos

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('espectador');
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      id: crypto.randomUUID(),
      name: name.trim() || 'Usuario',
      email: email.trim(),
      role,
      coins: 100,
      points: 0
    };
    saveUser(user);
    navigate('/');
  };

  return (
    <div className="login-container">
      <form onSubmit={onSubmit} className="login-form">
        <h2>🎥 Iniciar sesión / Registro</h2>

        <label>Nombre</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
        />

        <label>Correo</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@correo.com"
        />

        <label>Rol</label>
        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="espectador">👀 Espectador</option>
          <option value="streamer">🎙️ Streamer</option>
        </select>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
