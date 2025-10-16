import { useState, useEffect } from "react";
import LevelBar from "../components/LevelBar";
import { getActiveUser, updateUser } from "../utils/storage";
import type { User } from "../utils/storage";

interface Video { id:string; title:string; likes:number; }

export default function Home(){
  const [user,setUser] = useState<User | null>(getActiveUser());
  const [videos,setVideos] = useState<Video[]>(() => {
    const raw = localStorage.getItem('videos');
    if(raw) return JSON.parse(raw);
    return [
      {id:'v1', title:'Video de baile 🎶', likes:0},
      {id:'v2', title:'Sketch cómico 😂', likes:0},
      {id:'v3', title:'Video educativo 📚', likes:0},
    ];
  });

  useEffect(()=>{ localStorage.setItem('videos', JSON.stringify(videos)); },[videos]);
  useEffect(()=>{ if(user) updateUser(user); },[user]);

  const isLiked = (id:string)=> user?.likedVideos?.includes(id) ?? false;

  const handleLike = (id:string)=>{
    if(!user) return alert('Primero inicia sesión');
    if(isLiked(id)) return;
    setVideos(prev=> prev.map(v=> v.id===id ? {...v, likes: v.likes+1} : v));
    const updated:User = {...user, coins: user.coins+1, points: user.points+1, likedVideos: [...(user.likedVideos||[]), id]};
    setUser(updated);
    window.dispatchEvent(new CustomEvent('userChanged'));
  };

  return (
    <div>
      <div className="app-topnav">
        <div style={{fontWeight:700,color:'var(--accent)'}}>TikTok–UL</div>
        <nav style={{display:'flex',gap:12}}>
          <a className="muted" href="/">Inicio</a>
          <a className="muted" href="/mensajes">Mensajes</a>
          <a className="muted" href="/perfil">Perfil</a>
        </nav>
      </div>

      <h2 className="h1">Feed (Inicio)</h2>
      {user ? <p>Bienvenido, <strong>{user.name}</strong> 👋 — XP: {user.points}</p> : <p className="muted">Inicia sesión para interactuar con los videos 👇</p> }
      <div className="level-bar-wrap"><LevelBar currentXP={user?.points || 0} /></div>

      <div>
        {videos.map(v=>(
          <div key={v.id} className="video-card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div className="video-title">{v.title}</div>
            </div>
            <div className="muted" style={{margin:'8px 0'}}>❤️ {v.likes} likes</div>
            <button className="btn-like" onClick={()=>handleLike(v.id)} disabled={isLiked(v.id)}>{ isLiked(v.id) ? "Ya diste like" : "Dar like ❤️" }</button>
          </div>
        ))}
      </div>
    </div>
  );
}
