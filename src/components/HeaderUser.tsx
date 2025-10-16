import { getActiveUser, clearActiveUser } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HeaderUser() {
  const [user, setUser] = useState(getActiveUser());
  const navigate = useNavigate();

  useEffect(() => {
    const handle = () => setUser(getActiveUser());
    window.addEventListener("userChanged", handle);
    return () => window.removeEventListener("userChanged", handle);
  }, []);

  const logout = () => {
    clearActiveUser();
    window.dispatchEvent(new CustomEvent("userChanged"));
    navigate("/login");
  };

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{display:'flex',justifyContent:'flex-end'}}>
        {/* small hamburger */}
        <button style={{background:'transparent',border:'none',color:'#ddd',fontSize:18}}>☰</button>
      </div>

      {user ? (
        <div style={{padding:8,display:'flex',flexDirection:'column',gap:8,alignItems:'center'}}>
          <div style={{width:84,height:84,borderRadius:999,overflow:'hidden',border:'2px solid #2a2a2a'}}>
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="avatar" style={{width:'100%'}}/>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontWeight:700}}>{user.name}</div>
            <div className="muted">Saldo: <strong style={{color:'var(--accent)'}}>{user.coins}</strong></div>
            <div className="muted">Nivel: <strong style={{color:'var(--yellow)'}}>Guerrero</strong></div>
          </div>

          <div style={{display:'flex',flexDirection:'column',width:'100%',gap:8,marginTop:12}}>
            <button style={{padding:'8px 10px',borderRadius:8,border:'1px solid #2a2a2a',background:'transparent',color:'#ddd',cursor:'pointer'}}>💬 Mensajes</button>
            <button style={{padding:'8px 10px',borderRadius:8,border:'1px solid #2a2a2a',background:'#0f5132',color:'#fff',cursor:'pointer'}}>💰 Depositar</button>
          </div>

          <div style={{marginTop:'auto',width:'100%'}}>
            <button onClick={logout} style={{width:'100%',background:'#d9534f',color:'#fff',border:'none',padding:'10px 12px',borderRadius:10,cursor:'pointer'}}>Cerrar sesión</button>
            <div style={{display:'flex',justifyContent:'center',marginTop:10}}>
              <button style={{background:'#fff',borderRadius:20,padding:'6px 12px',border:'none',cursor:'pointer'}}>Modo claro</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{padding:12,color:'var(--muted)'}}>No has iniciado sesión.</div>
      )}
    </div>
  );
}
