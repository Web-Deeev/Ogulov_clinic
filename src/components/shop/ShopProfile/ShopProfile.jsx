import React, { useState, useContext } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';
import { Navigate } from 'react-router-dom';
import OrderHistory from './OrderHistory.jsx';
import ProfileInfo from './ProfileInfo.jsx';

const ShopProfile = () => {
  // Вытаскиваем favorites и данные сессии из твоего глобального контекста
  const { isAuthenticated, setIsAuthenticated, userProfile, favorites = [] } = useContext(ShopContext);
  
  // Управляем активными вкладками: 'orders', 'profile', 'favorites', 'addresses'
  const [activeTab, setActiveTab] = useState('orders'); 

  // Если пользователь не авторизован, бесшовно перенаправляем его на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/shop/auth" replace />;
  }

  // Безопасный сбор данных пользователя с дефолтными заглушками для тестов
  const userFirstName = userProfile?.first_name || 'Google';
  const userLastName = userProfile?.last_name || 'Пользователь';
  const userEmail = userProfile?.email || 'ogulov.fan@gmail.com';

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4 position-relative pb-2" style={{ borderBottom: '2px solid #ffc107', display: 'inline-block' }}>
        Личный кабинет
      </h2>
      
      <div className="row g-4">
        {/* Левая панель меню ЛК */}
        <div className="col-md-4 col-lg-3">
          <div className="card border-0 shadow-sm p-3 bg-light rounded-3">
            
            {/* АВАТАР-БЛОК (Кликабельный, заменяет кнопку "Мой профиль") */}
            <div 
              onClick={() => setActiveTab('profile')}
              className="d-flex align-items-center mb-3 pb-3 border-bottom border-secondary-subtle p-2 rounded-2"
              style={{
                cursor: 'pointer',
                backgroundColor: activeTab === 'profile' ? '#ffffff' : 'transparent',
                border: activeTab === 'profile' ? '1px solid #ffc107' : '1px solid transparent',
                boxShadow: activeTab === 'profile' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s ease-in-out',
                userSelect: 'none'
              }}
              title="Нажмите, чтобы открыть Мой профиль и безопасность"
            >
              {/* Адаптивная круглая аватарка (Автоматически переключается между ФОТО и БУКВОЙ) */}
              <div 
                className="bg-warning rounded-circle d-flex align-items-center justify-content-center fw-bold text-dark me-3 overflow-hidden shadow-sm" 
                style={{ width: '45px', height: '45px', minWidth: '45px', position: 'relative' }}
              >
                {userProfile?.avatar_url ? (
                  // Если у пользователя загружено фото или прилетел аватар от Google
                  <img 
                    src={userProfile.avatar_url} 
                    alt="User Avatar" 
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      // Защита: если ссылка на фото побьется, мягко возвращаем букву
                      e.target.style.display = 'none';
                      const fallbackLetter = e.target.nextSibling;
                      if (fallbackLetter) fallbackLetter.style.display = 'block';
                    }}
                  />
                ) : null}
                
                {/* Твоя стандартная буква-заглушка (показывается, если фото отсутствует) */}
                <span style={{ display: userProfile?.avatar_url ? 'none' : 'block' }}>
                  {userFirstName ? userFirstName.toUpperCase() : 'U'}
                </span>
              </div>
              
              {/* Текстовые данные пользователя */}
              <div className="text-truncate">
                <h6 className={`fw-bold mb-0 text-truncate ${activeTab === 'profile' ? 'text-warning' : 'text-dark'}`}>
                  {userFirstName} {userLastName}
                </h6>
                <small className="text-muted text-truncate d-block">{userEmail}</small>
              </div>
            </div>
            
            {/* СПИСОК ОСТАЛЬНЫХ ВКЛАДОК (Пункт "Мой профиль" отсюда полностью вырезан) */}
            <div className="list-group list-group-flush gap-1">
              <button 
                onClick={() => setActiveTab('orders')} 
                className={`list-group-item list-group-item-action border-0 rounded-2 fw-semibold ${activeTab === 'orders' ? 'bg-warning text-dark' : 'bg-transparent'}`}
              >
                📦 Мои заказы
              </button>

              <button 
                onClick={() => setActiveTab('favorites')} 
                className={`list-group-item list-group-item-action border-0 rounded-2 fw-semibold ${activeTab === 'favorites' ? 'bg-warning text-dark' : 'bg-transparent'}`}
              >
                ❤️ Избранное
                {favorites.length > 0 && (
                  <span className="badge bg-danger text-white ms-2 float-end rounded-pill small">{favorites.length}</span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('addresses')} 
                className={`list-group-item list-group-item-action border-0 rounded-2 fw-semibold ${activeTab === 'addresses' ? 'bg-warning text-dark' : 'bg-transparent'}`}
              >
                📍 Адреса доставки
              </button>

              <button 
                onClick={() => setIsAuthenticated(false)} 
                className="list-group-item list-group-item-action border-0 text-danger rounded-2 fw-semibold mt-3 bg-transparent border-top pt-3 rounded-0"
              >
                🚪 Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Правая часть: Контент выбранной вкладки */}
        <div className="col-md-8 col-lg-9">
          <div className="card shadow-sm p-4 border-0 rounded-3 bg-white">
            
            {/* Рендеринг компонента по условию выбранного таба */}
            {activeTab === 'orders' && <OrderHistory />}
            
            {/* Профиль и безопасность (Данные + Пароль) открываются при клике на верхний Аватар-блок */}
            {activeTab === 'profile' && <ProfileInfo />}
            
            {/* Секция: Избранное */}
            {activeTab === 'favorites' && (
              <div>
                <h4 className="fw-bold text-dark mb-4">Отложенные товары</h4>
                {favorites.length > 0 ? (
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    {favorites.map((product) => (
                      <div className="col" key={product.id}>
                        <div className="card h-100 border border-secondary-subtle rounded-3 p-2 text-center shadow-sm">
                          <img 
                            src={product.image || "/product/placeholder.jpg"} 
                            className="card-img-top object-fit-contain p-2" 
                            alt={product.name} 
                            style={{ height: '130px' }} 
                          />
                          <div className="card-body p-2">
                            <h6 className="card-title fw-bold mb-1 text-truncate text-dark small">{product.name}</h6>
                            <p className="text-success fw-bold mb-0 small">{product.price} сом</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <span style={{ fontSize: '3rem' }}>🤍</span>
                    <p className="mt-3 mb-0 fw-medium">В списке избранного пока ничего нет.</p>
                  </div>
                )}
              </div>
            )}

            {/* Секция: Адреса доставки */}
            {activeTab === 'addresses' && (
              <div>
                <h4 className="fw-bold text-dark mb-3">Сохранённые адреса</h4>
                <p className="text-muted small mb-4">Данные используются для автоматического заполнения полей при оформлении заказа.</p>
                
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-3 border border-secondary-subtle bg-light position-relative">
                      <span className="badge bg-secondary text-white mb-2 rounded-1 fw-normal">Основной</span>
                      <h6 className="fw-bold text-dark mb-1">г. Бишкек</h6>
                      <p className="text-muted small mb-0">{userProfile.address || 'Адрес по умолчанию не указан in профиле'}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-3 border bg-transparent h-100 d-flex align-items-center justify-content-center" style={{ borderStyle: 'dashed', borderColor: '#dee2e6' }}>
                      <button className="btn btn-link text-decoration-none text-secondary fw-semibold small shadow-none border-0">
                        ➕ Добавить адрес
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;
