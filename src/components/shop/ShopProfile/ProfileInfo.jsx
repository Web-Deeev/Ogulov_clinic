import React, { useState, useContext } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';

const ProfileInfo = () => {
  const { userProfile, setUserProfile } = useContext(ShopContext);
  const [formData, setFormData] = useState({ ...userProfile });

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserProfile(formData);
    alert('Данные профиля успешно обновлены!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="fw-bold mb-4 text-dark">Личные данные</h4>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small fw-medium text-muted mb-1">Имя</label>
          <input 
            type="text" 
            className="form-control" 
            value={formData.first_name || ''} 
            onChange={e => setFormData({...formData, first_name: e.target.value})} 
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-medium text-muted mb-1">Фамилия</label>
          <input 
            type="text" 
            className="form-control" 
            value={formData.last_name || ''} 
            onChange={e => setFormData({...formData, last_name: e.target.value})} 
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-medium text-muted mb-1">Email (Используется как логин)</label>
          <input 
            type="email" 
            className="form-control bg-light" 
            value={formData.email || ''} 
            disabled 
            readOnly 
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-medium text-muted mb-1">Телефон</label>
          <input 
            type="tel" 
            className="form-control" 
            value={formData.phone || ''} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
          />
        </div>
        <div className="col-12">
          <label className="form-label small fw-medium text-muted mb-1">Адрес доставки по умолчанию</label>
          <textarea 
            className="form-control" 
            rows="2" 
            value={formData.address || ''} 
            onChange={e => setFormData({...formData, address: e.target.value})} 
          />
        </div>
        <div className="col-12 mt-4">
          <button 
            type="submit" 
            className="btn btn-warning fw-bold px-4" 
            style={{ backgroundColor: '#ffc107', borderColor: '#ffc107' }}
          >
            Сохранить изменения
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileInfo;
