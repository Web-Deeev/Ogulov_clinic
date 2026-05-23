import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx'; // Проверь правильность пути к контексту

// Имитация базы данных Django. Эти никнеймы система посчитает занятыми
const OCCUPIED_USERNAMES = ['admin', 'ogulov', 'root', 'clinic_manager', 'test_user'];

const ShopAuth = () => {
  const { setIsAuthenticated, setUserProfile } = useContext(ShopContext);
  
  // Переключатель вкладок: 'magic' (без пароля) или 'classic' (регистрация по нику)
  const [authMethod, setAuthMethod] = useState('magic');
  
  // Состояния полей форм
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 1. Обработка беспарольного входа (Magic Link)
  const handleMagicSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setLoading(true);

    // Имитируем отправку ссылки Джангой на почту
    setTimeout(() => {
      setIsAuthenticated(true);
      setUserProfile({
        username: email.split('@')[0], // Делаем временный ник из почты
        email: email,
        first_name: "Покупатель"
      });
      localStorage.setItem('access_token', 'mock_jwt_magic_token');
      setLoading(false);
      navigate('/shop/profile'); // Переходим в личный кабинет
    }, 1200);
  };

  // 2. Обработка классической регистрации с проверкой УНИКАЛЬНОСТИ
  const handleClassicRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    setError('');
    setLoading(true);

    // А) Проверка уникальности никнейма (как в Django Serializers)
    const isUsernameTaken = OCCUPIED_USERNAMES.includes(username.toLowerCase().trim());

    if (isUsernameTaken) {
      setTimeout(() => {
        setLoading(false);
        setError(`Пользователь с никнеймом "${username}" уже зарегистрирован. Придумайте другой.`);
      }, 800);
      return; // Стопаем код, редиректа НЕ будет
    }

    // Б) Валидация длины пароля
    if (password.length < 6) {
      setTimeout(() => {
        setLoading(false);
        setError('Пароль слишком короткий. Минимум 6 символов.');
      }, 400);
      return; // Стопаем код
    }

    // В) Успешный сценарий — пишем в память и переходим в кабинет
    setTimeout(() => {
      setIsAuthenticated(true);
      setUserProfile({
        username: username.trim(),
        email: email.trim(),
        first_name: ""
      });
      
      // Записываем токен, чтобы фронтенд сессия не слетала
      localStorage.setItem('access_token', 'mock_jwt_classic_flow_success');
      
      setLoading(false);
      navigate('/shop/profile'); // Бесшовный e-commerce переход в кабинет
    }, 1200);
  };

  // 3. Быстрый вход через Google API (Без пароля)
  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      setIsAuthenticated(true);
      setUserProfile({
        username: "google_buyer",
        email: "ogulov.fan@gmail.com",
        first_name: "Google Пользователь"
      });
      localStorage.setItem('access_token', 'mock_jwt_google_success');
      setLoading(false);
      navigate('/shop/profile');
    }, 1000);
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
              onClick={() => { setAuthMethod('magic'); setError(''); }}
              style={authMethod === 'magic' ? { fontWeight: '700' } : {}}
            >
              Войти
            </button>
          </li>
          <li className="nav-item flex-grow-1 text-center">
            <button
              type="button"
              className={`nav-link w-100 rounded-pill fw-semibold small py-2 transition-all ${authMethod === 'classic' ? 'bg-warning text-dark shadow-sm' : 'text-muted bg-transparent'}`}
              onClick={() => { setAuthMethod('classic'); setError(''); }}
              style={authMethod === 'classic' ? { fontWeight: '700' } : {}}
            >
              Регистрация
            </button>
          </li>
        </ul>

        <h3 className="fw-bold text-center mb-2">
          {authMethod === 'magic' ? 'Быстрый вход' : 'Создать аккаунт'}
        </h3>
        <p className="text-muted text-center small mb-4">
          {authMethod === 'magic' 
            ? 'Введите почту — мы пришлем одноразовую ссылку для мгновенного входа' 
            : 'Придумайте уникальный никнейм и пароль для доступа к личному кабинету'}
        </p>

        {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

        {/* Форма 1: Магический беспарольный вход */}
        {authMethod === 'magic' && (
          <form onSubmit={handleMagicSubmit}>
            <div className="mb-4">
              <label className="form-label small fw-medium text-muted">Электронная почта</label>
              <input 
                type="email" 
                className="form-control py-2 shadow-none" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-warning w-100 py-2.5 fw-bold text-dark shadow-sm mb-3" 
              disabled={loading}
              style={{ backgroundColor: '#ffc107', borderColor: '#ffc107' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              ) : 'Продолжить'}
            </button>
          </form>
        )}

        {/* Форма 2: Регистрация */}
        {authMethod === 'classic' && (
          <form onSubmit={handleClassicRegisterSubmit}>
            <div className="mb-2">
              <label className="form-label small fw-medium text-muted mb-1">Никнейм (username)</label>
              <input 
                type="text" 
                className="form-control py-2 shadow-none" 
                placeholder="Заняты: admin, ogulov, root" 
                required 
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                disabled={loading}
              />
            </div>

            <div className="mb-2">
              <label className="form-label small fw-medium text-muted mb-1">Электронная почта</label>
              <input 
                type="email" 
                className="form-control py-2 shadow-none" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-medium text-muted mb-1">Пароль</label>
              <input 
                type="password" 
                className="form-control py-2 shadow-none" 
                placeholder="Минимум 6 символов" 
                required 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-warning w-100 py-2.5 fw-bold text-dark shadow-sm mb-3" 
              disabled={loading}
              style={{ backgroundColor: '#ffc107', borderColor: '#ffc107' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              ) : 'Зарегистрироваться'}
            </button>
          </form>
        )}

        {/* Сквозной блок Google */}
        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1 text-muted" />
          <span className="mx-3 text-muted small fw-medium text-nowrap">или</span>
          <hr className="flex-grow-1 text-muted" />
        </div>

        <button 
          type="button" 
          className="btn btn-outline-dark w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center border-secondary-subtle shadow-none"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <span className="me-2 text-danger fw-bold" style={{ fontSize: '1.1rem' }}>G</span> 
          Войти через Google
        </button>

      </div>
    </div>
  );
};

export default ShopAuth;
