// src/components/Chat.tsx
import { useState } from 'react';
import { getActiveUser, updateUser } from '../utils/storage';
import { getLevelInfo } from '../utils/leveling';
import { useNotification } from '../context/NotificationContext';
import './Chat.css';

interface Message {
  id: number;
  user: string;
  level: string;
  text: string;
}

// --- Datos para simular espectadores aleatorios ---
const RANDOM_USERS = [
  { name: 'NinjaFan', level: 'Leyenda' },
  { name: 'GamerX', level: 'Guerrero' },
  { name: 'ArtLover', level: 'Héroe' },
  { name: 'MusicMan', level: 'Novato' },
];
const RANDOM_MESSAGES = ['¡Qué buena jugada!', 'jajaja, muy bueno', '¡Saludos desde Perú!', 'Me encanta este stream', 'F'];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: 'Admin', level: 'Dios', text: '¡Bienvenidos al stream!' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const user = getActiveUser();
  const { showNotification } = useNotification();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const oldLevelName = getLevelInfo(user.points).currentLevelName;
    const updatedUser = { ...user, points: user.points + 1 };
    updateUser(updatedUser);
    const newLevelName = getLevelInfo(updatedUser.points).currentLevelName;

    if (oldLevelName !== newLevelName) {
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

    // --- Simulación de respuesta de otro espectador ---
    setTimeout(() => {
      const randomUser = RANDOM_USERS[Math.floor(Math.random() * RANDOM_USERS.length)];
      const randomMessageText = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];
      const spectatorMessage: Message = {
        id: Date.now() + 1,
        user: randomUser.name,
        level: randomUser.level,
        text: randomMessageText,
      };
      setMessages(prev => [...prev, spectatorMessage]);
    }, 1500); // Responde después de 1.5 segundos
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