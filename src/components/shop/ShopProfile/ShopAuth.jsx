import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';
import shop from '@/api/shop';

const ShopAuth = () => {
  const { setIsAuthenticated, setUserProfile } = useContext(ShopContext);
  const [authMethod, setAuthMethod] = useState('magic');
  const [loginStep, setLoginStep] = useState(1);
  const [loginPhone, setLoginPhone] = useState('+996 ');
  const [loginPassword, setLoginPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);


  const [registerForm, setRegisterForm] = useState({
    phone: '+996 ', firstName: '', lastName: '', regEmail: '', regPassword: ''
  });

  const handlePhoneChange = (value, type) => {
    if (!value.startsWith('+996 ')) value = '+996 ';
    type === 'login' ? setLoginPhone(value) : setRegisterForm({ ...registerForm, phone: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (loginStep === 1) return setLoginStep(2);
    setLoading(true); setError('');
    try {
      const data = await shop.loginUser({ username: loginPhone.replace(/\D/g, ''), password: loginPassword });
      localStorage.setItem('access_token', data?.access || data?.token);
      setIsAuthenticated(true);
      setUserProfile(data?.user || { phone: loginPhone });
      navigate('/shop/profile');
    } catch (err) {
      setError(err.response?.data?.detail || 'Неверный номер телефона или пароль.');
    } finally { setLoading(false); }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const payload = {
      username: registerForm.phone.replace(/\D/g, ''),
      phone: registerForm.phone.trim(),
      first_name: registerForm.firstName.trim(),
      last_name: registerForm.lastName.trim(),
      email: registerForm.regEmail.trim(),
      password: registerForm.regPassword
    };
    try {
      const data = await shop.registerUser(payload);
      const token = data?.access || data?.token;
      if (token) {
        localStorage.setItem('access_token', token);
        setIsAuthenticated(true);
        setUserProfile(data?.user || payload);
        navigate('/shop/profile');
      } else { setError('Сервер не вернул токен.'); }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения в базу.');
    } finally { setLoading(false); }
  };
  return (
    <div className="container my-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="card border-0 shadow-sm p-4 w-100" style={{ maxWidth: '440px', borderRadius: '12px' }}>
        
        {/* Переключатель вкладок (Bootstrap Pills) */}
        <ul className="nav nav-pills justify-content-center mb-4 p-1 bg-light rounded-pill" style={{ border: '1px solid #e9ecef' }}>
          <li className="nav-item flex-grow-1 text-center">
            <button
              type="button"
              className={`nav-link w-100 rounded-pill fw-semibold small py-2 transition-all ${authMethod === 'magic' ? 'bg-warning text-dark shadow-sm' : 'text-muted bg-transparent'}`}
              onClick={() => { setAuthMethod('magic'); setLoginStep(1); setError(''); }}
              style={authMethod === 'magic' ? { fontWeight: '700' } : {}}
            >
              Войти
            </button>
          </li>
          <li className="nav-item flex-grow-1 text-center">
            <button
              type="button"
              className={`nav-link w-100 rounded-pill fw-semibold small py-2 transition-all ${authMethod === 'register' ? 'bg-warning text-dark shadow-sm' : 'text-muted bg-transparent'}`}
              onClick={() => { setAuthMethod('register'); setError(''); }}
              style={authMethod === 'register' ? { fontWeight: '700' } : {}}
            >
              Регистрация
            </button>
          </li>
        </ul>

        {/* Динамический заголовок */}
        <h3 className="fw-bold text-center mb-2">
          {authMethod === 'magic' 
            ? (loginStep === 1 ? 'Вход в кабинет' : 'Ввод пароля') 
            : 'Создать аккаунт'}
        </h3>
        <p className="text-muted text-center small mb-4">
          {authMethod === 'magic' 
            ? (loginStep === 1 ? 'Введите номер телефона для входа' : 'Введите ваш пароль доступа') 
            : 'Заполните данные для безопасного оформления заказов'}
        </p>

        {error && <div className="alert alert-danger py-2 small text-center rounded-3">⚠️ {error}</div>}

        {/* Форма 1: Пошаговый вход */}
        {authMethod === 'magic' && (
          <form onSubmit={handleLoginSubmit}>
            {loginStep === 1 ? (
              <div className="mb-4">
                <label className="form-label small fw-medium text-muted">Номер телефона (ваш логин)</label>
                <input 
                  type="tel" 
                  className="form-control py-2 shadow-none text-start fw-bold" 
                  required 
                  value={loginPhone}
                  onChange={(e) => handlePhoneChange(e.target.value, 'login')}
                  disabled={loading}
                />
              </div>
            ) : (
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-medium text-muted mb-0">Пароль</label>
                  <button 
                    type="button" 
                    onClick={() => setLoginStep(1)} 
                    className="btn btn-link p-0 text-decoration-none small text-secondary" 
                    style={{ fontSize: '12px' }}
                  >
                    Изменить номер
                  </button>
                </div>
                <div className="input-group">
                  <input 
                    type={showLoginPassword ? "text" : "password"} 
                    className="form-control py-2 shadow-none text-start" 
                    placeholder="Введите пароль" 
                    required 
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setError(''); }}
                    disabled={loading}
                  />
                  <button 
                    type="button"
                    className="btn btn-outline-secondary border-start-0 px-3 bg-white text-muted shadow-none"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{ borderColor: '#dee2e6' }}
                  >
                    {showLoginPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-warning w-100 py-2.5 fw-bold text-dark shadow-sm mb-3" 
              disabled={loading}
              style={{ backgroundColor: '#ffc107', borderColor: '#ffc107' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              ) : (loginStep === 1 ? 'Далее →' : 'Войти в аккаунт')}
            </button>
          </form>
        )}

        {/* Форма 2: Регистрация */}
        {authMethod === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="mb-2">
              <label className="form-label small fw-medium text-muted mb-1">Номер телефона (ваш логин)</label>
              <input 
                type="tel" 
                name="phone"
                className="form-control py-2 shadow-none text-start fw-bold" 
                required 
                value={registerForm.phone}
                onChange={(e) => handlePhoneChange(e.target.value, 'register')}
                disabled={loading}
              />
            </div>

            <div className="row g-2 mb-2">
              <div className="col-6">
                <label className="form-label small fw-medium text-muted mb-1">Имя</label>
                <input 
                  type="text" 
                  name="firstName"
                  className="form-control py-2 shadow-none text-start" 
                  placeholder="Иван" 
                  required 
                  value={registerForm.firstName}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-medium text-muted mb-1">Фамилия</label>
                <input 
                  type="text" 
                  name="lastName"
                  className="form-control py-2 shadow-none text-start" 
                  placeholder="Иванов" 
                  required 
                  value={registerForm.lastName}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label small fw-medium text-muted mb-1">Электронная почта</label>
              <input 
                type="email" 
                name="regEmail"
                className="form-control py-2 shadow-none text-start" 
                placeholder="name@example.com" 
                required 
                value={registerForm.regEmail}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-medium text-muted mb-1">Пароль</label>
              <div className="input-group">
                <input 
                  type={showRegPassword ? "text" : "password"} 
                  name="regPassword"
                  className="form-control py-2 shadow-none text-start" 
                  placeholder="Минимум 6 символов" 
                  required 
                  value={registerForm.regPassword}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
                <button 
                  type="button"
                  className="btn btn-outline-secondary border-start-0 px-3 bg-white text-muted shadow-none"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{ borderColor: '#dee2e6' }}
                >
                  {showRegPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-warning w-100 py-2.5 fw-bold text-dark shadow-sm" 
              disabled={loading}
              style={{ backgroundColor: '#ffc107', borderColor: '#ffc107' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              ) : 'Зарегистрироваться'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ShopAuth;
