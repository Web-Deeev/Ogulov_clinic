import React, { useEffect, useState, useContext, useRef } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';
import shopService from '@/api/shop';

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

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Локальные состояния для обработки отправки данных и вывода ошибок бэка
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // 🟢 ДОБАВЛЕНО: Стейты управления видимостью (Показать/Скрыть) для каждого поля пароля
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =========================================================================
  // 🎯 ПУЛЕНЕПРОБИВАЕМАЯ СИНХРОНИЗАЦИЯ С БАЗОЙ ДАННЫХ (ОДИН РАЗ ПРИ МОНТИРОВАНИИ)
  // =========================================================================
  useEffect(() => {
    if (userProfile && !isInitialLoaded.current) {
      // Форматируем телефон из базы под строгую маску фронтенда
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

      // Запираем триггер: последующие ререндеры контекста больше не сбросят ввод юзера
      isInitialLoaded.current = true;
    }
  }, [userProfile]);

  // Хэндлер изменений инпутов профиля с защитой префикса +996
  const handleProfileInputChange = (e, fieldName) => {
    const value = e.target.value;
    // Жестко запрещаем стирать международный код Кыргызстана
    if (fieldName === 'phone' && !value.startsWith('+996 ')) return;
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  // 1. СТРОГОЕ СОХРАНЕНИЕ ЛИЧНЫХ ДАННЫХ В БАЗУ ДАННЫХ DJANGO
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    setProfileError('');

    // Очищаем пробелы и знаки для соответствия валидации БД
    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.length < 13) {
      setIsSubmittingProfile(false);
      return setProfileError('Введите корректный номер телефона полностью (например, +996 555 123 456).');
    }

    try {
      // Отправляем реальный запрос на бэкенд
      const updatedBackendUser = await shopService.updateUserProfile({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: cleanPhone, // Чистим номер телефона под валидатор бэка
        address: formData.address.trim()
      });

      if (setUserProfile) {
        // Записываем в контекст то, что вернула база данных, гарантируя синхронность данных на всем сайте
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

  // 2. СМЕНА ПАРОЛЯ С РЕАЛЬНЫМ ВЫЗОВОМ API БЭКЕНДА
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

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

    setIsSubmittingPassword(true);

    try {
      await shopService.changePassword(passwordData);
      
      setPasswordSuccess(true);
      alert('Пароль успешно изменён в базе данных!');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      console.error('Ошибка при изменении пароля:', err);
      const djangoPasswordError = err.response?.data?.old_password?.[0] || err.response?.data?.detail;
      setPasswordError(djangoPasswordError || 'Не удалось обновить пароль. Убедитесь, что старый пароль введен верно.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };
  return (
    <div>
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

      {/* СЕКЦИЯ 2: БЕЗОПАСНОСТЬ (СМЕНА ПАРОЛЯ) */}
      {/* СЕКЦИЯ 2: БЕЗОПАСНОСТЬ (СМЕНА ПАРОЛЯ) */}
      <form onSubmit={handlePasswordSubmit}>
        <h5 className="fw-bold mb-1 text-dark">Безопасность</h5>
        <p className="text-muted small mb-4">Вы можете изменить пароль для классического входа в систему</p>

        {passwordError && <div className="alert alert-danger py-2 small mb-3 text-center">⚠️ {passwordError}</div>}
        {passwordSuccess && <div className="alert alert-success py-2 small mb-3 text-center">🎉 Пароль успешно обновлен!</div>}

        <div className="row g-3">
          {/* Инпут 1: Текущий старый пароль */}
          <div className="col-md-4">
            <label className="form-label small fw-medium text-muted mb-1">Текущий старый пароль</label>
            <div className="input-group">
              <input 
                type={showOldPassword ? "text" : "password"} 
                className="form-control py-2 shadow-none" 
                placeholder="••••••••"
                value={passwordData.old_password}
                onChange={e => setPasswordData({...passwordData, old_password: e.target.value})}
                disabled={isSubmittingPassword}
                required
              />
              <button 
                type="button"
                className="btn btn-outline-secondary border-start-0 px-3 bg-white text-muted shadow-none"
                onClick={() => setShowOldPassword(!showOldPassword)}
                style={{ borderColor: '#dee2e6' }}
              >
                {showOldPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>
          
          {/* Инпут 2: Новый пароль */}
          <div className="col-md-4">
            <label className="form-label small fw-medium text-muted mb-1">Новый пароль</label>
            <div className="input-group">
              <input 
                type={showNewPassword ? "text" : "password"} 
                className="form-control py-2 shadow-none" 
                placeholder="Не менее 6 символов"
                value={passwordData.new_password}
                onChange={e => setPasswordData({...passwordData, new_password: e.target.value})}
                disabled={isSubmittingPassword}
                required
              />
              <button 
                type="button"
                className="btn btn-outline-secondary border-start-0 px-3 bg-white text-muted shadow-none"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{ borderColor: '#dee2e6' }}
              >
                {showNewPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Инпут 3: Подтверждение нового пароля */}
          <div className="col-md-4">
            <label className="form-label small fw-medium text-muted mb-1">Подтвердите новый пароль</label>
            <div className="input-group">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                className="form-control py-2 shadow-none" 
                placeholder="Повторите пароль"
                value={passwordData.confirm_password}
                onChange={e => setPasswordData({...passwordData, confirm_password: e.target.value})}
                disabled={isSubmittingPassword}
                required
              />
              <button 
                type="button"
                className="btn btn-outline-secondary border-start-0 px-3 bg-white text-muted shadow-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ borderColor: '#dee2e6' }}
              >
                {showConfirmPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <div className="col-12 mt-3">
            <button 
              type="submit" 
              className="btn btn-outline-dark fw-semibold px-4 py-2 d-flex align-items-center justify-content-center shadow-sm"
              disabled={!passwordData.old_password || !passwordData.new_password || isSubmittingPassword}
            >
              {isSubmittingPassword ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ОБНОВЛЕНИЕ ПАРОЛЯ...
                </>
              ) : 'Обновить пароль'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
