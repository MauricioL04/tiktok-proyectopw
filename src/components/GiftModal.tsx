import { useState } from 'react';
import { getActiveUser, updateUser } from '../utils/storage';
import type { Gift } from '../utils/types';
import { useAlert } from '../context/AlertContext';
import { useNotification } from '../context/NotificationContext';
import { getLevelInfo } from '../utils/leveling';
import './GiftModal.css';

const DEFAULT_GIFT_LIST: Gift[] = [
  { id: 'g1', name: 'Rosa', icon: '🌹', cost: 10, points: 5 },
  { id: 'g2', name: 'Corazón', icon: '❤️', cost: 50, points: 25 },
  { id: 'g3', name: 'Fuego', icon: '🔥', cost: 100, points: 60 },
  { id: 'g4', name: 'Diamante', icon: '💎', cost: 500, points: 300 },
];

interface GiftModalProps {
  onClose: () => void;
  isStreamerSelfView?: boolean;
}

export default function GiftModal({ onClose, isStreamerSelfView = false }: GiftModalProps) {
  const [feedback, setFeedback] = useState('');
  const user = getActiveUser();
  const { showAlert } = useAlert();
  const { showNotification } = useNotification();

  const availableGifts = user?.customGifts && user.customGifts.length > 0
    ? [...DEFAULT_GIFT_LIST, ...user.customGifts]
    : DEFAULT_GIFT_LIST;

  const handleSendGift = (gift: Gift) => {
    if (isStreamerSelfView) return;

    setFeedback('');
    if (!user) {
      setFeedback('Error: No se encontró el usuario.');
      return;
    }
    if (user.coins < gift.cost) {
      setFeedback('No tienes suficientes monedas para enviar este regalo.');
      return;
    }

    const oldLevelName = getLevelInfo(user.points).currentLevelName;
    const updatedUser = {
      ...user,
      coins: user.coins - gift.cost,
      points: user.points + gift.points,
    };
    updateUser(updatedUser);
    const newLevelName = getLevelInfo(updatedUser.points).currentLevelName;

    if (oldLevelName !== newLevelName) {
      showNotification(`¡Nuevo nivel alcanzado! Felicitaciones, ${user.name}. Ahora eres ${newLevelName}.`);
    }

    window.dispatchEvent(new CustomEvent("userChanged"));
    showAlert({ userName: user.name, giftName: gift.name, giftIcon: gift.icon });
    setFeedback(`¡Enviaste un/a ${gift.name}!`);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isStreamerSelfView ? 'Regalos Disponibles' : 'Enviar un Regalo'}</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <div className="gift-grid">
          {availableGifts.map((gift) => {
            const canAfford = user ? user.coins >= gift.cost : false;
            const isDisabled = !canAfford || !!feedback || isStreamerSelfView;
            let buttonText = 'Enviar';
            if (isStreamerSelfView) {
              buttonText = 'No disponible';
            } else if (!canAfford) {
              buttonText = 'Insuficiente';
            }

            return (
              <div key={gift.id} className="gift-card">
                <div className="gift-icon">{gift.icon}</div>
                <div className="gift-name">{gift.name}</div>
                <div className="gift-cost">{gift.cost.toLocaleString()} monedas</div>
                <div className="gift-points">+{gift.points} puntos</div>
                <button
                  onClick={() => handleSendGift(gift)}
                  disabled={isDisabled}
                  className="send-gift-button"
                >
                  {buttonText}
                </button>
              </div>
            );
          })}
        </div>
        {feedback && <div className="feedback-message">{feedback}</div>}
        {isStreamerSelfView && <p className="self-view-note">No puedes enviarte regalos a ti mismo.</p>}
      </div>
    </div>
  );
}