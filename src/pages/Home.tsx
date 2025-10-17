// src/pages/Home.tsx
import { useState } from "react";
import { Link } from 'react-router-dom';
import { getActiveUser } from "../utils/storage";
import GiftModal from "../components/GiftModal";
import "./Home.css";

interface Stream {
  id: string;
  title: string;
  author: string;
  viewers: number;
  thumb: string;
  category: string;
}

const SAMPLE_STREAMS: Stream[] = [
  { id: "s1", title: "Batalla de baile en vivo", author: "@dance_master", viewers: 1245, thumb: "https://picsum.photos/seed/stream1/800/500", category: "Baile" },
  { id: "s2", title: "Coding live: build a mini-app", author: "@devlucas", viewers: 832, thumb: "https://picsum.photos/seed/stream2/800/500", category: "Tecnología" },
  { id: "s3", title: "Cocina rápida: 3 recetas en 15 min", author: "@chefmarie", viewers: 674, thumb: "https://picsum.photos/seed/stream3/800/500", category: "Cocina" },
  { id: "s4", title: "Gameplay top: jornada épica", author: "@gamerPro", viewers: 4200, thumb: "https://picsum.photos/seed/stream4/800/500", category: "Gaming" },
  { id: "s5", title: "Charla: productividad y estudio", author: "@studybuddy", viewers: 290, thumb: "https://picsum.photos/seed/stream5/800/500", category: "Educación" },
];

const CATEGORIES = ["Todo", "Baile", "Tecnología", "Cocina", "Gaming", "Educación"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("Todo");
  const [isGiftModalOpen, setGiftModalOpen] = useState(false);
  const user = getActiveUser();
  const filtered = activeCategory === "Todo" ? SAMPLE_STREAMS : SAMPLE_STREAMS.filter(s => s.category === activeCategory);

  return (
    <>
      <div className="home-page">
        <div className="home-top">
          <div className="home-title">Streams populares</div>
          <div className="home-subtitle muted">Explora transmisiones en vivo y contenido destacado</div>
        </div>

        <Link to="/clip/c1" className="clip-link">
          <section className="clip-of-week">
            <div className="clip-left">
              <div className="clip-badge">Clip de la semana</div>
              <h3 className="clip-title">Batalla de baile: Final en vivo</h3>
              <p className="muted">Presentado por <strong>@dance_master</strong> • 3.2k viewers</p>
              <p className="clip-desc muted">Un resumen destacado de la final de baile de la semana — cortes, reacciones y lo mejor del show.</p>
            </div>
            <div className="clip-thumb">
              <img src="https://picsum.photos/seed/clip/1200/700" alt="Clip de la semana" />
            </div>
          </section>
        </Link>

        <section className="categories">
          <div className="categories-title">Categorías</div>
          <div className="categories-list">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-chip ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="streams-section">
          <div className="streams-header">
            <h4>{activeCategory === "Todo" ? "Tendencias ahora" : `Tendencias · ${activeCategory}`}</h4>
            <div className="muted">{filtered.length} streams</div>
          </div>
          <div className="streams-grid">
            {filtered.map(s => (
              <article key={s.id} className="stream-card">
                <Link to={`/stream/${s.id}`} className="stream-thumbnail-link">
                  <div className="thumb-wrap">
                    <img src={s.thumb} alt={s.title} />
                    <div className="viewers-badge">👁️ {s.viewers.toLocaleString()}</div>
                  </div>
                </Link>
                <div className="stream-info">
                  <div className="stream-title">{s.title}</div>
                  <div className="muted">{s.author} · {s.category}</div>
                  {user && (
                    <button className="gift-button" onClick={() => setGiftModalOpen(true)}>
                      🎁 Enviar Regalo
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      {isGiftModalOpen && <GiftModal onClose={() => setGiftModalOpen(false)} />}
    </>
  );
}