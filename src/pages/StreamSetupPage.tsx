// src/pages/StreamSetupPage.tsx
import { useNavigate } from 'react-router-dom';
import './StreamSetupPage.css';

export default function StreamSetupPage() {
  const navigate = useNavigate();

  const handleStartStreaming = () => {
    // Redirige al nuevo panel de control en vivo
    navigate("/stream/live");
  };

  return (
    <div className="stream-setup-page">
      <div className="setup-panel">
        <h2>Configura tu Stream</h2>
        
        <label htmlFor="title">Título</label>
        <input id="title" type="text" placeholder="Ej: Jugando y charlando un rato" />

        <label htmlFor="description">Descripción</label>
        <textarea id="description" rows={4} placeholder="Habla un poco sobre lo que harás hoy..."></textarea>

        <fieldset>
          <legend>Opciones del Chat</legend>
          <div>
            <input type="radio" id="chat-all" name="chat-mode" value="all" defaultChecked />
            <label htmlFor="chat-all">Chat para todos</label>
          </div>
          <div>
            <input type="radio" id="chat-followers" name="chat-mode" value="followers" />
            <label htmlFor="chat-followers">Modo solo seguidores</label>
          </div>
        </fieldset>

        <div className="setup-actions">
          <button onClick={() => navigate(-1)} className="cancel-button">Cancelar</button>
          <button onClick={handleStartStreaming} className="start-button">Iniciar Transmisión</button>
        </div>
      </div>

      <div className="live-preview">
        <div className="video-placeholder">Tu video aparecerá aquí</div>
        <div className="chat-placeholder">
          <p>El chat aparecerá aquí</p>
        </div>
      </div>
    </div>
  );
}