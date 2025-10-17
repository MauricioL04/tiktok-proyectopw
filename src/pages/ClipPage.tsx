// src/pages/ClipPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getActiveUser, toggleFollowStreamer } from '../utils/storage';
import { MOCK_STREAMERS } from '../utils/mockData';
import { useNotification } from '../context/NotificationContext';
import './ClipPage.css';

export default function ClipPage() {
  const { clipId } = useParams<{ clipId: string }>();
  const { showNotification } = useNotification();
  const [user, setUser] = useState(getActiveUser());
  
  // Lógica de ejemplo para obtener los datos del clip y streamer
  const clipData = { title: 'Batalla de baile: Final en vivo', views: 3200, date: 'hace 7 días' };
  const streamerInfo = MOCK_STREAMERS['dance_master'];

  // --- CAMBIOS CLAVE AQUÍ ---
  const [isFollowing, setIsFollowing] = useState(user?.following?.includes(streamerInfo.id) || false);
  // Nuevo estado para manejar el conteo de seguidores visualmente
  const [followerCount, setFollowerCount] = useState(streamerInfo.followers);

  useEffect(() => {
    const handleUserChange = () => {
      const updatedUser = getActiveUser();
      setUser(updatedUser);
      // Actualiza el estado de "seguir" basado en los datos más recientes del usuario
      const nowFollowing = updatedUser?.following?.includes(streamerInfo.id) || false;
      setIsFollowing(nowFollowing);
    };
    window.addEventListener("userChanged", handleUserChange);
    return () => window.removeEventListener("userChanged", handleUserChange);
  }, [streamerInfo.id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification('¡Enlace del clip copiado al portapapeles!');
  };

  const handleFollow = () => {
    if (!user) {
      showNotification('Debes iniciar sesión para seguir a un streamer.');
      return;
    }
    // Llama a la función que actualiza la lista de seguidos en localStorage
    toggleFollowStreamer(streamerInfo.id);

    // Actualiza el contador de seguidores visualmente en la pantalla
    if (isFollowing) {
      setFollowerCount(prev => prev - 1); // Si ya lo seguía, resta 1
    } else {
      setFollowerCount(prev => prev + 1); // Si no lo seguía, suma 1
    }
  };

  return (
    <div className="clip-page-layout">
      <div className="clip-main-content">
        <div className="clip-video-player">
          <img src="https://picsum.photos/seed/clip/1280/720" alt="Reproductor de video" />
          <div className="video-controls">
            <span>▶</span><div className="progress-bar"></div><span>🔊</span>
          </div>
        </div>
        <div className="clip-info-section">
          <div className="clip-title-bar">
            <h4>{clipData.title}</h4>
            <button onClick={handleShare} className="share-button">🔗 Compartir</button>
          </div>
          <p className="clip-meta">{clipData.views.toLocaleString()} visualizaciones • {clipData.date}</p>
          <div className="streamer-info-bar">
            <img src={streamerInfo.profilePic} alt="Avatar del streamer" />
            <div className="streamer-details">
              <strong>{streamerInfo.name}</strong>
              {/* Ahora muestra el contador de seguidores del estado local */}
              <small>{followerCount.toLocaleString()} seguidores</small>
            </div>
            <button onClick={handleFollow} className={isFollowing ? 'following-button' : 'follow-button-clip'}>
              {isFollowing ? '✅ Seguido' : 'Seguir'}
            </button>
          </div>
        </div>
      </div>
      <aside className="clip-chat-panel">
        <div className="chat-header"><h5>Chat del video</h5></div>
        <div className="chat-body"><p>La repetición de chat de este clip ya no está disponible.</p></div>
      </aside>
    </div>
  );
}