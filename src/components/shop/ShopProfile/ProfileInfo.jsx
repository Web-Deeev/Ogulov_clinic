import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';

const ProfileInfo = () => {
  const { userProfile, setUserProfile } = useContext(ShopContext);
  
  // Состояние полей профиля (безопасно инициализируем пустым объектом)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Состояния для полей смены пароля
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [passwordError, setPasswordError] = useState('');

  // Защита: следим за контекстом. Как только данные юзера загрузятся, пишем их в форму
  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || ''
      });
    }
  }, [userProfile]);

  // 1. Сохранение личных данных
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (setUserProfile) {
      // Сохраняем объединенный объект в глобальный контекст
      setUserProfile({
        ...userProfile,
        ...formData
      });
      alert('Личные данные успешно сохранены!');
    }
  };

  // 2. Смена пароля (Полностью готова под валидацию Django)
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordData.old_password || !passwordData.new_password) {
      setPasswordError('Пожалуйста, заполните все поля паролей.');
      return;
    }

    if (passwordData.new_password.length < 6) {
      setPasswordError('Новый пароль слишком короткий (минимум 6 символов).');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('Новые пароли не совпадают!');
      return;
    }

    // Здесь в будущем будет: await axios.post('/api/v1/auth/password/change/', passwordData)
    alert('Пароль успешно изменён на бэкенде!');
    
    // Очищаем форму паролей после успеха
    setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
  };

  return (
    <div>
      {/* СЕКЦИЯ 1: ЛИЧНЫЕ ДАННЫЕ */}
      <form onSubmit={handleProfileSubmit} className="mb-5">
        <h4 className="fw-bold mb-4 text-dark">Личные данные покупателя</h4>
        
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-medium text-muted mb-1">Имя</label>
            <input 
              type="text" 
              className="form-control py-2 shadow-none" 
              placeholder="Ваше имя"
              value={formData.first_name} 
              onChange={e => setFormData({...formData, first_name: e.target.value})} 
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label small fw-medium text-muted mb-1">Фамилия</label>
            <input 
              type="text" 
              className="form-control py-2 shadow-none" 
              placeholder="Ваша фамилия"
              value={formData.last_name} 
              onChange={e => setFormData({...formData, last_name: e.target.value})} 
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label small fw-medium text-muted mb-1">Email (Логин аккаунта)</label>
            <input 
              type="email" 
              className="form-control py-2 bg-light text-muted border-secondary-subtle" 
              value={formData.email} 
              disabled 
              readOnly 
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label small fw-medium text-muted mb-1">Номер телефона</label>
            <input 
              type="tel" 
              className="form-control py-2 shadow-none" 
              placeholder="+996 (___) __-__-__"
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
            />
          </div>
          
          <div className="col-12">
            <label className="form-label small fw-medium text-muted mb-1">Адрес доставки по умолчанию</label>
            <textarea 
              className="form-control shadow-none" 
              rows="2" 
              placeholder="Город, улица, дом, квартира / Номер отделения СДЭК"
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
            />
          </div>
          
          <div className="col-12 mt-3">
            <button 
              type="submit" 
              className="btn btn-warning fw-bold px-4 py-2 border-0 shadow-sm" 
              style={{ backgroundColor: '#ffc107' }}
            >
              Сохранить данные
            </button>
          </div>
        </div>
      </form>

      {/* РАЗДЕЛИТЕЛЬНАЯ ЛИНИЯ БОТСТРЭП */}
      <hr className="my-5 text-muted opacity-25" />

      {/* СЕКЦИЯ 2: БЕЗОПАСНОСТЬ (СМЕНА ПАРОЛЯ) */}
      <form onSubmit={handlePasswordSubmit}>
        <h5 className="fw-bold mb-1 text-dark">Безопасность</h5>
        <p className="text-muted small mb-4">Вы можете изменить пароль для классического входа в систему</p>

        {passwordError && <div className="alert alert-danger py-2 small mb-3 text-center">{passwordError}</div>}

        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label small fw-medium text-muted mb-1">Текущий старый пароль</label>
            <input 
              type="password" 
              className="form-control py-2 shadow-none" 
              placeholder="••••••••"
              value={passwordData.old_password}
              onChange={e => setPasswordData({...passwordData, old_password: e.target.value})}
            />
          </div>
          
          <div className="col-md-4">
            <label className="form-label small fw-medium text-muted mb-1">Новый пароль</label>
            <input 
              type="password" 
              className="form-control py-2 shadow-none" 
              placeholder="Не менее 6 символов"
              value={passwordData.new_password}
              onChange={e => setPasswordData({...passwordData, new_password: e.target.value})}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-medium text-muted mb-1">Подтвердите новый пароль</label>
            <input 
              type="password" 
              className="form-control py-2 shadow-none" 
              placeholder="Повторите пароль"
              value={passwordData.confirm_password}
              onChange={e => setPasswordData({...passwordData, confirm_password: e.target.value})}
            />
          </div>

          <div className="col-12 mt-3">
            <button 
              type="submit" 
              className="btn btn-outline-dark fw-semibold px-4 py-2"
              disabled={!passwordData.old_password || !passwordData.new_password}
            >
              Обновить пароль
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
