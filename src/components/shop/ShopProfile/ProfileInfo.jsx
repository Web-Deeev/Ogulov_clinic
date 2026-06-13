// src/components/shop/ShopProfile/ProfileInfo.jsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';
import shopService from '@/api/shop';

// Импортируем наш изолированный блок безопасности
import ChangePass from './ChangePass.jsx';

const ProfileInfo = () => {
  const { userProfile, setUserProfile } = useContext(ShopContext);
  
  // 🛡️ ЗАЩИТА: Флаг для предотвращения race condition при фоновом обновлении профиля
  const isInitialLoaded = useRef(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '+996 ',
    address: ''
  });

  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  // =========================================================================
  // 🎯 СИНХРОНИЗАЦИЯ С БАЗОЙ ДАННЫХ (ОДИН РАЗ ПРИ МОНТИРОВАНИИ)
  // =========================================================================
  useEffect(() => {
    if (userProfile && !isInitialLoaded.current) {
      let rawPhone = userProfile.phone || '';
      let formattedPhone = '+996 ';

      if (rawPhone) {
        const cleanRaw = rawPhone.replace(/\s+/g, '');
        if (cleanRaw.startsWith('+')) {
          formattedPhone = cleanRaw;
        } else if (cleanRaw.startsWith('996')) {
          formattedPhone = `+${cleanRaw}`;
        } else {
          formattedPhone = `+996 ${cleanRaw}`;
        }
      }

      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
        phone: formattedPhone,
        address: userProfile.address || ''
      });

      isInitialLoaded.current = true;
    }
  }, [userProfile]);

  const handleProfileInputChange = (e, fieldName) => {
    const value = e.target.value;
    if (fieldName === 'phone' && !value.startsWith('+996 ')) return;
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    setProfileError('');

    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.length < 13) {
      setIsSubmittingProfile(false);
      return setProfileError('Введите корректный номер телефона полностью (например, +996 555 123 456).');
    }

    try {
      const updatedBackendUser = await shopService.updateUserProfile({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: cleanPhone, 
        address: formData.address.trim()
      });

      if (setUserProfile) {
        setUserProfile({
          ...userProfile,
          ...updatedBackendUser
        });
        alert('Личные данные успешно сохранены в базе данных клиники!');
      }
    } catch (err) {
      console.error('Ошибка при сохранении профиля:', err);
      const djangoPhoneError = err.response?.data?.phone?.[0];
      const djangoGeneralError = err.response?.data?.detail;
      setProfileError(djangoPhoneError || djangoGeneralError || 'Не удалось сохранить личные данные на сервере.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  return (
    <div className="profile-info-container">
      {/* СЕКЦИЯ 1: ЛИЧНЫЕ ДАННЫЕ */}
      <form onSubmit={handleProfileSubmit} className="mb-5">
        <h4 className="fw-bold mb-4 text-dark">Личные данные покупателя</h4>
        
        {profileError && <div className="alert alert-danger py-2 small mb-3">{profileError}</div>}
        
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-medium text-muted mb-1">Имя</label>
            <input 
              type="text" 
              className="form-control py-2 shadow-none" 
              placeholder="Ваше имя"
              value={formData.first_name} 
              onChange={e => handleProfileInputChange(e, 'first_name')} 
              disabled={isSubmittingProfile}
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label small fw-medium text-muted mb-1">Фамилия</label>
            <input 
              type="text" 
              className="form-control py-2 shadow-none" 
              placeholder="Ваша фамилия"
              value={formData.last_name} 
              onChange={e => handleProfileInputChange(e, 'last_name')} 
              disabled={isSubmittingProfile}
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
              onChange={e => handleProfileInputChange(e, 'phone')} 
              disabled={isSubmittingProfile}
            />
          </div>
          
          <div className="col-12">
            <label className="form-label small fw-medium text-muted mb-1">Адрес доставки по умолчанию</label>
            <textarea 
              className="form-control shadow-none" 
              rows="2" 
              placeholder="Город, улица, дом, квартира / Номер отделения СДЭК"
              value={formData.address} 
              onChange={e => handleProfileInputChange(e, 'address')} 
              disabled={isSubmittingProfile}
            />
          </div>
          
          <div className="col-12 mt-3">
            <button 
              type="submit" 
              className="btn btn-warning fw-bold px-4 py-2 border-0 shadow-sm d-flex align-items-center justify-content-center" 
              style={{ backgroundColor: '#ffc107' }}
              disabled={isSubmittingProfile}
            >
              {isSubmittingProfile ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  СОХРАНЕНИЕ...
                </>
              ) : 'Сохранить данные'}
            </button>
          </div>
        </div>
      </form>

      <hr className="my-5 text-muted opacity-25" />

      {/* 🎯 СЕКЦИЯ 2: ИЗОЛИРОВАННЫЙ КОМПОНЕНТ БЕЗОПАСНОСТИ */}
      <ChangePass />
    </div>
  );
};

export default ProfileInfo;
