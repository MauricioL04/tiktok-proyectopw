import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveUser, updateUser } from '../utils/storage';
import { getStreamerLevelInfo } from '../utils/leveling';
import { useNotification } from '../context/NotificationContext';
import Chat from '../components/Chat';
import GiftModal from '../components/GiftModal';
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
  const [isGiftModalOpen, setGiftModalOpen] = useState(false);

  useEffect(() => {
    const handleUserChange = () => {
      const currentUser = getActiveUser();
      setUser(currentUser);
      if (!currentUser) { navigate('/login'); }
    };
    window.addEventListener("userChanged", handleUserChange);
    if (!user) { navigate('/login'); }
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

  if (!user) { return <p>Cargando...</p>; }

  const streamerHours = user.streamerHours || 0;
  const levelInfo = getStreamerLevelInfo(streamerHours);

  return (
    <>
      <div className="live-dashboard-layout">
        <div className="live-main-content">
          <div className="live-video-player">
            <p>Simulación de Video EN VIVO</p>
          </div>
          <div className="live-controls-info">
            <div className="live-indicator-timer">
              <span className="live-indicator">● EN VIVO</span>
              <span>{formatTime(elapsedTime)}</span>
            </div>
            <div className="streamer-level-info">
              Nivel Streamer: <strong>{levelInfo.levelName}</strong> ({levelInfo.progress}% para el sig.)
            </div>
            <button onClick={() => setGiftModalOpen(true)} className="view-gifts-button">
              🎁 Ver Regalos
            </button>
            <button onClick={handleEndStream} className="end-stream-button">
              Detener Transmisión
            </button>
          </div>
        </div>
        <div className="live-chat-panel">
          <Chat />
        </div>
      </div>
      {isGiftModalOpen && (
        <GiftModal
          onClose={() => setGiftModalOpen(false)}
          isStreamerSelfView={true}
        />
      )}
    </>
  );
}