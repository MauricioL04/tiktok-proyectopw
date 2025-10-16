// src/pages/GiftManagementPage.tsx
import { useState } from 'react';
import { getActiveUser, updateUser } from '../utils/storage';
import type { Gift } from '../utils/storage';
import GiftFormModal from '../components/GiftFormModal';
import './GiftManagementPage.css';

export default function GiftManagementPage() {
  const [user, setUser] = useState(getActiveUser());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  const handleSaveGift = (gift: Gift) => {
    if (!user) return;

    const existingGifts = user.customGifts || [];
    let updatedGifts;

    if (existingGifts.find(g => g.id === gift.id)) {
      // Editar
      updatedGifts = existingGifts.map(g => g.id === gift.id ? gift : g);
    } else {
      // Añadir
      updatedGifts = [...existingGifts, gift];
    }

    const updatedUser = { ...user, customGifts: updatedGifts };
    updateUser(updatedUser);
    setUser(updatedUser);
    setIsModalOpen(false);
    setEditingGift(null);
  };

  const handleDeleteGift = (giftId: string) => {
    if (!user || !window.confirm("¿Estás seguro de que quieres eliminar este regalo?")) return;

    const updatedGifts = (user.customGifts || []).filter(g => g.id !== giftId);
    const updatedUser = { ...user, customGifts: updatedGifts };
    updateUser(updatedUser);
    setUser(updatedUser);
  };

  const handleEdit = (gift: Gift) => {
    setEditingGift(gift);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingGift(null);
    setIsModalOpen(true);
  };

  return (
    <div className="gift-management-page">
      <div className="page-header">
        <h2>Gestionar Regalos del Canal</h2>
        <button onClick={handleAddNew} className="add-new-button">
          + Crear Nuevo Regalo
        </button>
      </div>
      
      <div className="gifts-list">
        {(user?.customGifts || []).length > 0 ? (
          user?.customGifts?.map(gift => (
            <div key={gift.id} className="gift-list-item">
              <div className="gift-details">
                <span className="gift-item-icon">{gift.icon}</span>
                <span className="gift-item-name">{gift.name}</span>
                <span className="gift-item-cost">Costo: {gift.cost} monedas</span>
                <span className="gift-item-points">Puntos: +{gift.points}</span>
              </div>
              <div className="gift-actions">
                <button onClick={() => handleEdit(gift)} className="edit-btn">Editar</button>
                <button onClick={() => handleDeleteGift(gift.id)} className="delete-btn">Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-gifts-message">Aún no has creado ningún regalo personalizado. ¡Añade uno para empezar!</p>
        )}
      </div>

      {isModalOpen && (
        <GiftFormModal 
          gift={editingGift}
          onSave={handleSaveGift}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGift(null);
          }}
        />
      )}
    </div>
  );
}