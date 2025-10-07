import { levelForPoints, nextLevelTarget, percentToNext } from '../utils/leveling';

export default function LevelBar({ points }: { points: number }) {
  const lvl = levelForPoints(points);
  const target = nextLevelTarget(points);
  const pct = percentToNext(points);

  return (
    <div className="level">
      <div className="level__header">
        <strong>Nivel {lvl}</strong>
        <span className="level__tag">{points} / {target} pts</span>
      </div>
      <div className="level__bar">
        <div className="level__barFill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
