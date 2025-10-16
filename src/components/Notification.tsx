// src/components/Notification.tsx
import { useState, useEffect } from 'react';
import './Notification.css';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const DURATION = 5000; // 5 segundos

export default function Notification({ message, onClose }: NotificationProps) {
  const [progress, setProgress] = useState(0);

  // Efecto para cerrar la notificación después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(onClose, DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Efecto para animar la barra de progreso
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => prev + (100 / (DURATION / 50)));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="notification-container">
      <p>{message}</p>
      <div className="progress-bar-notification">
        <div className="progress-bar-notification-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}