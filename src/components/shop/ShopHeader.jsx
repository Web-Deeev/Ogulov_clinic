import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useShop } from './ShopMainDetails/ShopContext';
import ShopTopBar from './ShopHeader/ShopTopBar'; // Подключаем вынесенный TopBar
import ShopSearchDropdown from './ShopHeader/ShopSearchDropdown'; // Подключаем вынесенный Поиск

import './ShopHeader/ShopHeader.css';


export { ShopTopBar }; // Экспортируем наружу для совместимости с твоим роутером

export function ShopHeader() {
  const navigate = useNavigate();
  const { activeCategory, setActiveCategory, setActiveSubcategory, setSearchQuery, cart = [], menuItems = [] } = useShop();

  // Вычисляем общее количество штук товаров в корзине
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <header className="shop-header">
      <div className="container shop-header-inner shop-header-top-row">
        {/* Логотип */}
        <Link to="/shop" className="shop-sub-logo-link" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
          <img src="/images/logo.png?v=2" alt="Интернет-магазин" className="shop-logo-img" style={{ maxHeight: '45px', objectFit: 'contain', display: 'block' }} />
        </Link>

        {/* Центр: Инфо-меню и Вынесенный умный поиск */}
        <div className="shop-center">
          <nav className="shop-info-menu">
            <NavLink to="/shop/about" className={({ isActive }) => isActive ? 'shop-active' : ''}>О магазине</NavLink>
            <NavLink to="/shop/payment" className={({ isActive }) => isActive ? 'shop-active' : ''}>Оплата</NavLink>
            <NavLink to="/shop/delivery" className={({ isActive }) => isActive ? 'shop-active' : ''}>Доставка</NavLink>
            <NavLink to="/shop/contacts" className={({ isActive }) => isActive ? 'shop-active' : ''}>Контакты</NavLink>
          </nav>
          
          {/* Аккуратный вызов вынесенного компонента */}
          <ShopSearchDropdown />
        </div>

        {/* Правая часть: СТРОГО ТОЛЬКО КОРЗИНА (Лишние кнопки Профиля и Избранного полностью удалены!) */}
        <div className="shop-actions">
          <button className="shop-cart" onClick={() => navigate('/shop/cart')}>
            🛒 Корзина: {totalItems > 0 ? `${totalItems} шт.` : 'пусто'}
          </button>
        </div>
      </div>

      {/* Желтая строка категорий */}
      <div className="container px-0 my-2">
        <nav className="shop-menu-row rounded shadow-sm" style={{ padding: '5px 15px' }}>
          <ul className="shop-menu-list mb-0">
            {menuItems
              .filter(item => item.id !== 'all') 
              .map((item) => (
                <li key={item.id} className="shop-menu-item">
                  <button 
                    className={`shop-menu-btn ${activeCategory === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCategory(item.id); 
                      setSearchQuery(''); 
                      if (setActiveSubcategory) {
                        setActiveSubcategory(`all-${item.id}`);
                      }
                      navigate('/shop');          
                    }}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
