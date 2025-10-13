import { useState, useEffect } from "react";
import LevelBar from "../components/LevelBar";
import { getActiveUser, updateUser } from "../utils/storage";
import type { User } from "../utils/storage";

interface Video {
  id: string;
  title: string;
  likes: number;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(getActiveUser());
  const [videos, setVideos] = useState<Video[]>(() => {
    const stored = localStorage.getItem("videos");
    if (stored) return JSON.parse(stored);
    return [
      { id: "v1", title: "Video de baile 🎶", likes: 0 },
      { id: "v2", title: "Sketch cómico 😂", likes: 0 },
      { id: "v3", title: "Video educativo 📚", likes: 0 },
    ];
  });

  // 🔹 Guardar el estado de los videos si cambia
  useEffect(() => {
    localStorage.setItem("videos", JSON.stringify(videos));
  }, [videos]);

  // 🔹 Guardar progreso del usuario si cambia
  useEffect(() => {
    if (user) updateUser(user);
  }, [user]);

  const isLikedByUser = (vid: string) =>
    user?.likedVideos?.includes(vid) ?? false;

  const handleLike = (id: string) => {
    if (!user) return alert("Primero inicia sesión.");
    if (isLikedByUser(id)) return; // ya dio like

    // 1️⃣ Actualizar contador local del video
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, likes: v.likes + 1 } : v))
    );

    // 2️⃣ Actualizar usuario (coins, puntos y likedVideos)
    const updatedUser: User = {
      ...user,
      coins: user.coins + 1,
      points: user.points + 1,
      likedVideos: [...(user.likedVideos || []), id],
    };

    setUser(updatedUser);
    window.dispatchEvent(new CustomEvent("userChanged"));
  };

  return (
    <div>
      <h2>Feed (Inicio)</h2>
      {user ? (
        <p>
          Bienvenido, <strong>{user.name}</strong> 👋 — XP: {user.points}
        </p>
      ) : (
        <p>Inicia sesión para interactuar con los videos 👇</p>
      )}

      <LevelBar currentXP={user?.points || 0} />

      <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
        {videos.map((v) => {
          const liked = isLikedByUser(v.id);
          return (
            <div
              key={v.id}
              style={{
                border: "1px solid #333",
                borderRadius: 12,
                padding: 16,
                background: "#181818",
              }}
            >
              <h3>{v.title}</h3>
              <p>❤️ {v.likes} likes</p>
              <button
                onClick={() => handleLike(v.id)}
                disabled={liked}
                style={{
                  background: liked ? "#333" : "#ff0050",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: 8,
                  cursor: liked ? "not-allowed" : "pointer",
                  border: "none",
                }}
              >
                {liked ? "Ya diste like" : "Dar like ❤️"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
