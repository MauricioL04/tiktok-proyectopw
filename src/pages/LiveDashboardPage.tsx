import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveUser, updateUser } from '../utils/storage';
import { getStreamerLevelInfo } from '../utils/leveling';
import { useNotification } from '../context/NotificationContext';
import './LiveDashboardPage.css';

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export default function LiveDashboardPage() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [user, setUser] = useState(getActiveUser());
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const handleUserChange = () => {
      const currentUser = getActiveUser();
      setUser(currentUser);
      if (!currentUser) {
        navigate('/login');
      }
    };
    window.addEventListener("userChanged", handleUserChange);
    if (!user) {
        navigate('/login');
    }
    return () => window.removeEventListener("userChanged", handleUserChange);
  }, [navigate, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEndStream = () => {
    if (!user) return;

    const durationInHours = elapsedTime / 3600;
    const oldLevelInfo = getStreamerLevelInfo(user.streamerHours || 0);
    const newTotalHours = (user.streamerHours || 0) + durationInHours;
    const newLevelInfo = getStreamerLevelInfo(newTotalHours);

    if (newLevelInfo.levelName !== oldLevelInfo.levelName) {
      showNotification(`¡Felicidades! Has subido a nivel de streamer ${newLevelInfo.levelName}.`);
    }

    const updatedUser = { ...user, streamerHours: newTotalHours };
    updateUser(updatedUser);
    window.dispatchEvent(new CustomEvent("userChanged"));
    navigate("/estadisticas");
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  const streamerHours = user.streamerHours || 0;
  const levelInfo = getStreamerLevelInfo(streamerHours);

  return (
    <div className="live-dashboard-page">
      <div className="live-header">
        <h1>Panel de Control en Vivo</h1>
        <div className="live-indicator">● EN VIVO</div>
      </div>

      <div className="live-stats">
        <div className="stat-card">
          <h4>Duración</h4>
          <p>{formatTime(elapsedTime)}</p>
        </div>
        <div className="stat-card">
          <h4>Espectadores</h4>
          <p>{Math.floor(Math.random() * 100) + 5}</p>
        </div>
        <div className="stat-card">
          <h4>Nuevos seguidores</h4>
          <p>{Math.floor(Math.random() * 5)}</p>
        </div>
      </div>

      <div className="card">
        <h3>Progreso de Nivel de Streamer</h3>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${levelInfo.progress}%` }}></div>
        </div>
        <p className="motivation-text">
          Nivel actual: <strong>{levelInfo.levelName}</strong>.
          {levelInfo.hoursToNext > 0
            ? ` Faltan ${levelInfo.hoursToNext.toFixed(2)} horas para el siguiente nivel.`
            : " ¡Has alcanzado el nivel máximo!"
          }
        </p>
      </div>

      <div className="live-actions">
        <p>Tu transmisión está en curso. Cuando termines, detén la transmisión para guardar tu progreso.</p>
        <button onClick={handleEndStream} className="end-stream-button">
          Detener Transmisión y Guardar
        </button>
      </div>
    </div>
  );
}