import { Link, NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home'; import Nosotros from './pages/Nosotros';
import TyC from './pages/TyC'; import Login from './pages/Login';
import { getUser, clearUser } from './utils/storage';

export default function App() {
  const u = getUser(); const navigate = useNavigate();
  return (
    <div>
      <nav style={{display:'flex',gap:12,padding:12,borderBottom:'1px solid #2b2b2b',alignItems:'center'}}>
        <Link to="/" style={{fontWeight:700}}>TikTok–UL</Link>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/nosotros">Nosotros</NavLink>
        <NavLink to="/tyc">TyC</NavLink>
        <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
          {u ? (
            <>
              <span style={{border:'1px solid #3a3a3a',padding:'4px 10px',borderRadius:999}}>
                {u.name} · {u.role} · 💰{u.coins}
              </span>
              <button onClick={()=>{ clearUser(); navigate('/login'); }}>Cerrar sesión</button>
            </>
          ) : (<NavLink to="/login">Login</NavLink>)}
        </div>
      </nav>
      <main style={{padding:16}}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/nosotros" element={<Nosotros/>} />
          <Route path="/tyc" element={<TyC/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </main>
    </div>
  );
}
