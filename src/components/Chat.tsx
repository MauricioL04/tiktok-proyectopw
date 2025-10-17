import { useState, useEffect, useRef } from 'react';
import { getActiveUser, updateUser } from '../utils/storage';
import { getLevelInfo, DEFAULT_VIEWER_LEVELS } from '../utils/leveling';
import { useNotification } from '../context/NotificationContext';
import './Chat.css';

interface Message {
  id: number;
  user: string;
  level: string;
  text: string;
}

const RANDOM_USERS_GENERIC = ['NinjaFan', 'GamerX', 'ArtLover', 'MusicMan', 'StreamFan123', 'RandomUser'];
const RANDOM_MESSAGES = ['¡Qué buena jugada!', 'jajaja, muy bueno', '¡Saludos desde Perú!', 'Me encanta este stream', 'F', 'Pog', 'Nice!', '¿Alguien sabe la canción?'];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: Date.now(), user: 'Admin', level: 'Dios', text: '¡Bienvenidos al stream!' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const user = getActiveUser();
  const { showNotification } = useNotification();
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const effectiveLevels = user?.viewerLevelConfig && user.viewerLevelConfig.length > 0
        ? user.viewerLevelConfig
        : DEFAULT_VIEWER_LEVELS;

      const randomUserName = RANDOM_USERS_GENERIC[Math.floor(Math.random() * RANDOM_USERS_GENERIC.length)];
      const randomLevel = effectiveLevels[Math.floor(Math.random() * effectiveLevels.length)].name;
      const randomMessageText = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];

      const spectatorMessage: Message = {
        id: Date.now(),
        user: randomUserName,
        level: randomLevel,
        text: randomMessageText,
      };
      setMessages(prev => [...prev, spectatorMessage]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const oldLevelName = getLevelInfo(user.points).currentLevelName;
    const updatedUser = { ...user, points: user.points + 1 };
    updateUser(updatedUser);
    const newLevelName = getLevelInfo(updatedUser.points).currentLevelName;

    if (oldLevelName !== newLevelName) {
      showNotification(`🎉 ¡Felicidades, ${user.name}! 🎉\n\nHas subido al nivel de espectador: ${newLevelName}`);
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
      <div className="chat-messages" ref={chatMessagesRef}>
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