// src/components/shop/ShopProfile/ChangePass.jsx
import React, { useState } from 'react';
import shopService from '@/api/shop';

const ChangePass = () => {
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Состояния для переключения видимости паролей (👁️/🙈)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Функциональный хэндлер ввода (prev) для исключения Race Conditions
  const handlePasswordInputChange = (fieldName, value) => {
    setPasswordData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    setPasswordError(''); 
    setPasswordSuccess(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    // Извлекаем значения синхронно, отсекая пробелы
    const oldP = passwordData.old_password.trim();
    const newP = passwordData.new_password.trim();
    const confP = passwordData.confirm_password.trim();

    if (!oldP || !newP || !confP) {
      setPasswordError('Пожалуйста, заполните все поля паролей.');
      return;
    }

    if (newP.length < 6) {
      setPasswordError('Новый пароль слишком короткий (минимум 6 символов).');
      return;
    }

    if (newP !== confP) {
      setPasswordError('Введенные новые пароли не совпадают!');
      return;
    }

    if (oldP === newP) {
      setPasswordError('Новый пароль не должен совпадать со старым.');
      return;
    }

    setIsSubmittingPassword(true);

    try {
      // Отправляем структурированные данные на бэкенд через твой сервис
      await shopService.changePassword({
        old_password: oldP,
        new_password: newP
      });
      
      // 🎯 СЕНИОР-UI-ФИКС: Никаких алертов. Выводим успех декларативно в верстку сверху формы
      setPasswordSuccess(true);
      
      // Полная очистка формы при успехе
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      console.error('Ошибка при изменении пароля:', err);
      
      if (err.response?.data) {
        console.log('--- ДЕТАЛЬНЫЙ ОТВЕТ DJANGO REST FRAMEWORK (400 BAD REQUEST) ---');
        console.log(err.response.data);
        console.log('--------------------------------------------------------------');
      }

      const data = err.response?.data;
      let extractError = '';

      if (data) {
        if (typeof data === 'string') {
          extractError = data;
        } else if (data.detail) {
          extractError = data.detail;
        } else if (data.non_field_errors) {
          extractError = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
        } else if (data.old_password) {
          // 🎯 ИСПРАВЛЕНО: Вытаскиваем строго первую строку ошибки из массива DRF
          extractError = Array.isArray(data.old_password) ? data.old_password[0] : data.old_password;
        } else if (data.new_password) {
          // 🎯 ИСПРАВЛЕНО: Теперь "This password is too common" чисто запишется в стейт без префиксов
          extractError = Array.isArray(data.new_password) ? data.new_password[0] : data.new_password;
        } else {
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            extractError = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
          }
        }
      }

      // Если в массиве прилетела строка на английском, переводим её для интерфейса клиники
      if (extractError.includes('too common')) {
        extractError = 'Этот пароль слишком распространен. Придумайте более сложный вариант.';
      }

      setPasswordError(extractError || 'Не удалось обновить пароль. Убедитесь, что старый пароль введен верно.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <form onSubmit={handlePasswordSubmit}>
      <h5 className="fw-bold mb-1 text-dark">Безопасность</h5>
      <p className="text-muted small mb-4">Вы можете изменить пароль для классического входа в систему</p>

      {/* Вывод плашек строго над инпутами */}
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
              onChange={e => handlePasswordInputChange('old_password', e.target.value)}
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
              onChange={e => handlePasswordInputChange('new_password', e.target.value)}
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
              onChange={e => handlePasswordInputChange('confirm_password', e.target.value)}
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
  );
};

export default ChangePass;
