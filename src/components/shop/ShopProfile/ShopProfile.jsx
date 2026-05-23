import React, { useContext } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function ShopProfile() {
  const { isAuthenticated, userProfile, favorites = [], logoutUser } = useContext(ShopContext);
  const navigate = useNavigate();

  // Если сессия отсутствует — отправляем на форму входа
  if (!isAuthenticated) {
    return <Navigate to="/shop/auth" replace />;
  }

  const userFirstName = userProfile?.first_name || 'Google';
  const userLastName = userProfile?.last_name || 'Пользователь';
  const userEmail = userProfile?.email || 'ogulov.fan@gmail.com';

  return (
    <div className="container my-5 text-dark">
      <h2 className="fw-bold mb-4 position-relative pb-2" style={{ borderBottom: '2px solid #ffc107', display: 'inline-block' }}>
        Личный кабинет
      </h2>
      
      <div className="row g-4">
        {/* Левая боковая панель навигации по ЛК */}
        <div className="col-md-4 col-lg-3">
          <div className="card border-0 shadow-sm p-3 bg-light rounded-3">
            
            {/* АВАТАР-БЛОК (Клик ведет на страницу изменения данных /shop/profile/info) */}
            <div 
              onClick={() => navigate('/shop/profile/info')}
              className="d-flex align-items-center mb-3 pb-3 border-bottom border-secondary-subtle p-2 rounded-2"
              style={{ cursor: 'pointer', userSelect: 'none' }}
              title="Нажмите, чтобы открыть Мой профиль"
            >
              <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center fw-bold text-dark me-3 overflow-hidden shadow-sm" style={{ width: '45px', height: '45px', minWidth: '45px' }}>
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Avatar" className="w-100 h-100 object-fit-cover" />
                ) : (
                  <span>{userFirstName ? userFirstName.toUpperCase().charAt(0) : 'U'}</span>
                )}
              </div>
              <div className="text-truncate">
                <h6 className="fw-bold mb-0 text-truncate text-dark">
                  {userFirstName} {userLastName}
                </h6>
                <small className="text-muted text-truncate d-block">{userEmail}</small>
              </div>
            </div>
            
            {/* Меню навигации через реальные URL пути */}
            <div className="list-group list-group-flush gap-1">
              <NavLink 
                to="/shop/profile/orders" 
                className={({ isActive }) => `list-group-item list-group-item-action border-0 rounded-2 fw-semibold text-start ${isActive ? 'bg-warning text-dark' : 'bg-transparent text-dark'}`}
              >
                📦 Мои заказы
              </NavLink>

              <NavLink 
                to="/shop/profile/favorites" 
                className={({ isActive }) => `list-group-item list-group-item-action border-0 rounded-2 fw-semibold text-start ${isActive ? 'bg-warning text-dark' : 'bg-transparent text-dark'}`}
              >
                ❤️ Избранное
                {favorites.length > 0 && <span className="badge bg-danger text-white ms-2 float-end rounded-pill small">{favorites.length}</span>}
              </NavLink>

              <NavLink 
                to="/shop/profile/addresses" 
                className={({ isActive }) => `list-group-item list-group-item-action border-0 rounded-2 fw-semibold text-start ${isActive ? 'bg-warning text-dark' : 'bg-transparent text-dark'}`}
              >
                📍 Адреса доставки
              </NavLink>

              <button onClick={logoutUser} className="list-group-item list-group-item-action border-0 text-danger rounded-2 fw-semibold mt-3 bg-transparent border-top pt-3 rounded-0 text-start">
                🚪 Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Правая часть: Сюда React Router динамически подставляет активный вложенный компонент */}
        <div className="col-md-8 col-lg-9">
          <div className="card shadow-sm p-4 border-0 rounded-3 bg-white h-100" style={{ minHeight: '400px' }}>
            <Outlet /> 
          </div>
        </div>

      </div>
    </div>
  );
}
