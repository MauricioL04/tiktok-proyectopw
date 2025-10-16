// src/components/Chat.tsx
import { useState } from 'react';
import { getActiveUser, updateUser } from '../utils/storage';
import { getLevelInfo } from '../utils/leveling';
import { useNotification } from '../context/NotificationContext'; // 1. Importa el hook
import './Chat.css';

interface Message {
  id: number;
  user: string;
  level: string;
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: 'Admin', level: 'Dios', text: '¡Bienvenidos al stream!' },
    { id: 2, user: 'Espectador1', level: 'Guerrero', text: '¡Hola a todos!' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const user = getActiveUser();
  const { showNotification } = useNotification(); // 2. Obtiene la función para mostrar notificaciones

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const oldLevelName = getLevelInfo(user.points).currentLevelName;
    const updatedUser = { ...user, points: user.points + 1 };
    updateUser(updatedUser);
    const newLevelName = getLevelInfo(updatedUser.points).currentLevelName;

    if (oldLevelName !== newLevelName) {
      // 3. Llama a la nueva notificación en lugar del alert
      showNotification(`¡Nuevo nivel alcanzado! Felicitaciones, ${user.name}. Ahora eres ${newLevelName}.`);
    }

    const message: Message = {
      id: Date.now(),
      user: user.name,
      level: newLevelName,
      text: newMessage.trim(),
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    window.dispatchEvent(new CustomEvent("userChanged"));
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className="chat-message">
            <span className="user-level-badge">{msg.level}</span>
            <strong className="user-name">{msg.user}:</strong>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      
      {user ? (
        <form onSubmit={handleSendMessage} className="chat-form">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enviar un mensaje..."
            className="chat-input"
          />
          <button type="submit" className="send-button">Enviar</button>
        </form>
      ) : (
        <div className="chat-login-prompt">
          <p>Inicia sesión para chatear.</p>
        </div>
      )}
    </div>
  );
}