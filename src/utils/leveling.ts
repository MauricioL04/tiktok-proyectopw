// src/utils/leveling.ts

// --- LÓGICA PARA NIVELES DE ESPECTADOR (basada en puntos) ---
const VIEWER_LEVELS = [
  { name: 'Novato', points: 0 },
  { name: 'Guerrero', points: 100 },
  { name: 'Héroe', points: 300 },
  { name: 'Leyenda', points: 700 },
  { name: 'Dios', points: 1500 },
];

export function getLevelInfo(userPoints: number) {
  let currentLevelIndex = 0;
  for (let i = VIEWER_LEVELS.length - 1; i >= 0; i--) {
    if (userPoints >= VIEWER_LEVELS[i].points) {
      currentLevelIndex = i;
      break;
    }
  }

  const currentLevel = VIEWER_LEVELS[currentLevelIndex];
  const nextLevel = VIEWER_LEVELS[currentLevelIndex + 1];

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


// --- LÓGICA PARA NIVELES DE STREAMER (basada en horas) ---
const STREAMER_LEVELS = [
  { name: 'Bronce', hours: 0 },
  { name: 'Plata', hours: 10 },
  { name: 'Oro', hours: 50 },
  { name: 'Diamante', hours: 200 },
];

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
};