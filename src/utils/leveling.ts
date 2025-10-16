// src/utils/leveling.ts
import { getActiveUser } from './storage';
import type { LevelConfig } from './storage';

// Exportamos los niveles por defecto para que otras partes de la app puedan usarlos
export const DEFAULT_VIEWER_LEVELS: LevelConfig[] = [
  { name: 'Novato', points: 0 },
  { name: 'Guerrero', points: 100 },
  { name: 'Héroe', points: 300 },
  { name: 'Leyenda', points: 700 },
  { name: 'Dios', points: 1500 },
];

const STREAMER_LEVELS = [
  { name: 'Bronce', hours: 0 },
  { name: 'Plata', hours: 10 },
  { name: 'Oro', hours: 50 },
  { name: 'Diamante', hours: 200 },
];

/**
 * Determina qué configuración de niveles usar: la personalizada del streamer o la por defecto.
 */
function getEffectiveViewerLevels(): LevelConfig[] {
  const user = getActiveUser();
  if (user?.viewerLevelConfig && user.viewerLevelConfig.length > 0) {
    return user.viewerLevelConfig;
  }
  return DEFAULT_VIEWER_LEVELS;
}

export function getLevelInfo(userPoints: number) {
  const viewerLevels = getEffectiveViewerLevels(); // Usa la configuración correcta
  let currentLevelIndex = 0;
  for (let i = viewerLevels.length - 1; i >= 0; i--) {
    if (userPoints >= viewerLevels[i].points) {
      currentLevelIndex = i;
      break;
    }
  }

  const currentLevel = viewerLevels[currentLevelIndex];
  const nextLevel = viewerLevels[currentLevelIndex + 1];

  if (!nextLevel) {
    return {
      currentLevelName: currentLevel.name,
      nextLevelName: null,
      pointsToNextLevel: 0,
      progressPercentage: 100,
    };
  }

  const pointsOfCurrentLevel = currentLevel.points;
  const pointsForNextLevel = nextLevel.points;
  const pointsInThisLevel = userPoints - pointsOfCurrentLevel;
  const pointsRange = pointsForNextLevel - pointsOfCurrentLevel;
  const progressPercentage = Math.floor((pointsInThisLevel / pointsRange) * 100);

  return {
    currentLevelName: currentLevel.name,
    nextLevelName: nextLevel.name,
    pointsToNextLevel: pointsForNextLevel - userPoints,
    progressPercentage: Math.max(0, Math.min(100, progressPercentage)),
  };
}

export function getStreamerLevelInfo(streamerHours: number) {
  let currentLevelIndex = 0;
  for (let i = STREAMER_LEVELS.length - 1; i >= 0; i--) {
    if (streamerHours >= STREAMER_LEVELS[i].hours) {
      currentLevelIndex = i;
      break;
    }
  }

  const currentLevel = STREAMER_LEVELS[currentLevelIndex];
  const nextLevel = STREAMER_LEVELS[currentLevelIndex + 1];

  if (!nextLevel) {
    return {
      levelName: currentLevel.name,
      hoursToNext: 0,
      progress: 100,
    };
  }

  const hoursInThisLevel = streamerHours - currentLevel.hours;
  const hoursRange = nextLevel.hours - currentLevel.hours;
  const progress = Math.floor((hoursInThisLevel / hoursRange) * 100);

  return {
    levelName: currentLevel.name,
    hoursToNext: nextLevel.hours - streamerHours,
    progress: progress,
  };
}