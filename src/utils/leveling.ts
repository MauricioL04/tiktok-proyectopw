const TARGETS = [0, 30, 70, 110, 160, 220, 300, 400, 600, 1000];

export function levelForPoints(points: number): number {
  let lvl = 1;
  for (const t of TARGETS) if (points >= t) lvl++;
  return Math.min(lvl, TARGETS.length + 1);
}

export function nextLevelTarget(points: number): number {
  for (const t of TARGETS) if (points < t) return t;
  return TARGETS[TARGETS.length - 1];
}

export function percentToNext(points: number): number {
  const target = nextLevelTarget(points);
  const prev = TARGETS[TARGETS.findIndex(t => t === target) - 1] ?? 0;
  const pct = ((points - prev) / (target - prev)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}
