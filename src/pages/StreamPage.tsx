// src/pages/StreamPage.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getActiveUser } from '../utils/storage';
import Chat from '../components/Chat';
import GiftModal from '../components/GiftModal'; // Importa el modal de regalos
import './StreamPage.css';

export default function StreamPage() {
  const navigate = useNavigate();
  const { streamId } = useParams();
  const user = getActiveUser();
  const [isGiftModalOpen, setGiftModalOpen] = useState(false); // Estado para el modal

  return (
    <>
      <div className="stream-page-layout">
        <div className="video-and-info-container">
          <div className="video-player-placeholder">
            <p>Video del Stream ID: {streamId}</p>
          </div>
          <div className="stream-details">
            <h3>Título del Stream Actual</h3>
            <p className="stream-description">Descripción del stream...</p>
            <div className="stream-actions">
              <button onClick={() => navigate('/')} className="back-button">
                ‹ Volver a la lista
              </button>
              {/* El botón de regalar ahora está aquí y solo es visible si hay sesión */}
              {user && (
                <button className="gift-button-stream" onClick={() => setGiftModalOpen(true)}>
                  🎁 Enviar Regalo
                </button>
              )}
            </div>
          </div>
        </div>
        <Chat />
      </div>

      {isGiftModalOpen && <GiftModal onClose={() => setGiftModalOpen(false)} />}
    </>
  );
}