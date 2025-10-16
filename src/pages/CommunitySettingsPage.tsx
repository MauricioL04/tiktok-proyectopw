// src/pages/CommunitySettingsPage.tsx
import { useState, useEffect } from 'react';
import { getActiveUser, updateUser } from '../utils/storage';
import type { LevelConfig } from '../utils/storage';
import { DEFAULT_VIEWER_LEVELS } from '../utils/leveling'; // Importaremos los niveles por defecto
import './CommunitySettingsPage.css';

export default function CommunitySettingsPage() {
  const [user, setUser] = useState(getActiveUser());
  const [levels, setLevels] = useState<LevelConfig[]>([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (user) {
      // Si el usuario tiene una configuración personalizada, la usamos. Si no, usamos la por defecto.
      setLevels(user.viewerLevelConfig && user.viewerLevelConfig.length > 0 ? user.viewerLevelConfig : DEFAULT_VIEWER_LEVELS);
    }
  }, [user]);

  const handlePointsChange = (index: number, points: number) => {
    const updatedLevels = [...levels];
    updatedLevels[index].points = points;
    setLevels(updatedLevels);
  };

  const handleSaveChanges = () => {
    if (!user) return;

    // Guardamos la configuración personalizada en el perfil del usuario
    const updatedUser = { ...user, viewerLevelConfig: levels };
    updateUser(updatedUser);
    setUser(updatedUser); // Actualiza el estado local para reflejar los cambios

    setFeedback('¡Cambios guardados con éxito!');
    setTimeout(() => setFeedback(''), 2000); // Oculta el mensaje después de 2 segundos
  };

  if (!user) return <p>Inicia sesión para acceder a esta página.</p>;

  return (
    <div className="community-settings-page">
      <div className="page-header">
        <h2>Configurar Niveles de Espectador</h2>
        <button onClick={handleSaveChanges} className="save-button">Guardar Cambios</button>
      </div>
      <p className="page-subtitle">
        Define los puntos que tus espectadores necesitan para alcanzar cada nivel en tu comunidad.
      </p>

      <div className="levels-config-list">
        {levels.map((level, index) => (
          <div key={index} className="level-config-item">
            <span className="level-name">{level.name}</span>
            <input 
              type="number"
              value={level.points}
              onChange={(e) => handlePointsChange(index, parseInt(e.target.value) || 0)}
              className="points-input"
              // El primer nivel siempre es 0 puntos y no se puede editar
              disabled={index === 0}
            />
            <span>puntos</span>
          </div>
        ))}
      </div>
      
      {feedback && <div className="feedback-message">{feedback}</div>}
    </div>
  );
}