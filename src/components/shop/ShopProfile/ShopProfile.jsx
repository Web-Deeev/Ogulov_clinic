import React, { useState, useContext } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';
import { Navigate } from 'react-router-dom';
import OrderHistory from './OrderHistory.jsx';
import ProfileInfo from './ProfileInfo.jsx';

const ShopProfile = () => {
  const { isAuthenticated, setIsAuthenticated, userProfile } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' или 'profile'

  // Если пользователь не авторизован, бесшовно перенаправляем его на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/shop/auth" replace />;
  }

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4 position-relative pb-2" style={{ borderBottom: '2px solid #ffc107', display: 'inline-block' }}>
        Личный кабинет
      </h2>
      
      <div className="row g-4">
        {/* Левая панель меню ЛК */}
        <div className="col-md-4 col-lg-3">
          <div className="card border-0 shadow-sm p-3 bg-light">
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom border-secondary-subtle">
              <div 
                className="bg-warning rounded-circle d-flex align-items-center justify-content-center fw-bold text-dark me-3" 
                style={{ width: '45px', height: '45px', minWidth: '45px' }}
              >
                {userProfile.first_name ? userProfile.first_name[0] : 'U'}
              </div>
              <div className="text-truncate">
                <h6 className="fw-bold mb-0 text-truncate">
                  {userProfile.first_name} {userProfile.last_name || ''}
                </h6>
                <small className="text-muted text-truncate d-block">{userProfile.email}</small>
              </div>
            </div>
            
            <div className="list-group list-group-flush gap-1">
              <button 
                onClick={() => setActiveTab('orders')} 
                className={`list-group-item list-group-item-action border-0 rounded-2 fw-semibold ${activeTab === 'orders' ? 'bg-warning text-dark' : 'bg-transparent'}`}
              >
                📦 Мои заказы
              </button>
              <button 
                onClick={() => setActiveTab('profile')} 
                className={`list-group-item list-group-item-action border-0 rounded-2 fw-semibold ${activeTab === 'profile' ? 'bg-warning text-dark' : 'bg-transparent'}`}
              >
                👤 Мой профиль
              </button>
              <button 
                onClick={() => setIsAuthenticated(false)} 
                className="list-group-item list-group-item-action border-0 text-danger rounded-2 fw-semibold mt-3 bg-transparent"
              >
                🚪 Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Правая часть: Контент выбранной вкладки */}
        <div className="col-md-8 col-lg-9">
          <div className="card shadow-sm p-4 border-0 rounded-3">
            {activeTab === 'orders' ? <OrderHistory /> : <ProfileInfo />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;
