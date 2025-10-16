// src/pages/Nosotros.tsx
import './Nosotros.css'; // Importamos el nuevo archivo de estilos

// --- Datos del Equipo ---
const teamMembers = [
  { name: 'Mauricio Linares', role: 'Líder del equipo' },
  { name: 'Leonardo Sotelo', role: 'Desarrollador' },
  { name: 'Carlos Robles', role: 'Desarrollador' },
  { name: 'Alonso Murillo', role: 'Desarrollador' },
  { name: 'Diego Salazar', role: 'Desarrollador' }
];

// Usaremos un ícono estándar para todos
const userIconUrl = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

export default function Nosotros() {
  return (
    <div className="nosotros-page">
      <h2 className="nosotros-title">Nuestro Equipo</h2>
      <p className="nosotros-subtitle">
        Conoce a las personas que hacen posible Streaming-UL.
      </p>
      
      <div className="team-grid">
        {teamMembers.map((member) => (
          <div key={member.name} className="member-card">
            <div className="member-photo-wrapper">
              <img 
                src={userIconUrl} 
                alt={`Foto de ${member.name}`} 
                className="member-photo" 
              />
            </div>
            <h3 className="member-name">{member.name}</h3>
            <p className="member-role">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}