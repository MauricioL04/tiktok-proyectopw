import { getUser } from '../utils/storage';
import LevelBar from '../components/LevelBar';

export default function Home() {
  const user = getUser();

  if (!user) {
    return <h2>Bienvenido 👋 Inicia sesión para ver tu contenido personalizado.</h2>;
  }

  if (user.role === 'streamer') {
    return (
      <section>
        <h2>🎙️ Panel del Streamer</h2>
        <p>Hola <strong>{user.name}</strong>.</p>
        <ul>
          <li>Puntos acumulados: <b>{user.points}</b></li>
          <li>Horas totales (mock): <b>{(user.points / 10).toFixed(1)}</b></li>
          <li>Monedas disponibles: 💰 <b>{user.coins}</b></li>
        </ul>
        <p style={{opacity:.8}}>Próximamente: iniciar/terminar transmisión y sumar métricas.</p>
      </section>
    );
  }

  // Espectador
  return (
    <section>
      <h2>👀 Feed del Espectador</h2>
      <p>Hola <strong>{user.name}</strong>. Este es tu progreso:</p>
      <div style={{maxWidth:480}}>
        <LevelBar points={user.points} />
      </div>
      <ul style={{marginTop:'1rem'}}>
        <li>Monedas actuales: 💰 <b>{user.coins}</b></li>
        <li>Puntos de participación: <b>{user.points}</b></li>
      </ul>
      <p style={{opacity:.8}}>✨ Envía regalos y participa para subir de nivel.</p>
    </section>
  );
}
