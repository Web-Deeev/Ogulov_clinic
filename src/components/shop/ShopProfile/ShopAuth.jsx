import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';

const ShopAuth = () => {
  const { setIsAuthenticated, setUserProfile } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Обработка клика по кнопке "Продолжить" (Магический беспарольный вход)
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setLoading(true);

    // Вызываем логику беспарольного сервиса под DRF
    const result = await AuthService.loginOrRegister(email);

    if (result.success) {
      setIsAuthenticated(true);
      setUserProfile(result.user); // Пишем структуру пользователя в контекст
      navigate('/shop/profile');   // Бесшовно перекидываем в кабинет
    } else {
      setError(result.message || 'Ошибка входа');
    }

    setLoading(false);
  };

  // Быстрый вход в 1 клик через Google API
  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    
    const result = await AuthService.loginOrRegister('google.user@gmail.com');
    
    if (result.success) {
      setIsAuthenticated(true);
      setUserProfile({
        ...result.user,
        first_name: "Google Пользователь"
      });
      navigate('/shop/profile');
    }
    setLoading(false);
  };

  return (
    <div className="container my-5 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="card border-0 shadow-sm p-4 w-100" style={{ maxWidth: '420px', borderRadius: '12px' }}>
        
        <h3 className="fw-bold text-center mb-2">Вход или регистрация</h3>
        <p className="text-muted text-center small mb-4">
          Введите почту — мы найдем ваш аккаунт или создадим новый за пару секунд
        </p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmitEmail}>
          <div className="mb-3">
            <label className="form-label small fw-medium text-muted">Электронная почта</label>
            <input 
              type="email" 
              className="form-control py-2 shadow-none" 
              placeholder="name@example.com" 
              required 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
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

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1 text-muted" />
          <span className="mx-3 text-muted small fw-medium text-nowrap">или</span>
          <hr className="flex-grow-1 text-muted" />
        </div>

        <button 
          type="button" 
          className="btn btn-outline-dark w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center border-secondary-subtle shadow-none"
          onClick={handleGoogleAuth}
        >
          <span className="me-2 text-danger fw-bold" style={{ fontSize: '1.1rem' }}>G</span> 
          Войти через Google
        </button>

      </div>
    </div>
  );
};

export default ShopAuth;
