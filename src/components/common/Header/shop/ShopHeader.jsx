// src/components/common/Header/shop/ShopHeader.jsx
import React, { useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

// 1. Импортируем твой контекст магазина
import { useShop } from '../../../../components/shop/ShopMainDetails/ShopContext.jsx';

// 2. Импортируем твой родной компонент Топбара (путь скорректирован)
import ShopTopBar from '../../../../components/shop/ShopHome/ShopTopBar.jsx';

// 3. Импортируем поиск
import ShopSearchDropdown from '../../../../components/shop/ShopHome/ShopSearchDropdown.jsx'; 

import './ShopHeader.css';

export function ShopHeader() {
  const navigate = useNavigate();
  
  // Достаем стейт и сеттеры из контекста
  const { 
    activeCategory, 
    setActiveCategory, 
    setActiveSubcategory, 
    setSearchQuery, 
    cart = [], 
    menuItems = [] 
  } = useShop();

  // Оптимизация: Считаем количество только если изменился массив корзины.
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item?.quantity || 1), 0);
  }, [cart]);

  // Хэндлер для сброса стейта при клике на логотип
  const handleLogoClick = () => {
    setActiveCategory('all');
    setSearchQuery('');
  };

  // Хэндлер переключения категорий
  const handleCategoryClick = (itemId) => {
    setActiveCategory(itemId); 
    setSearchQuery(''); 
    if (typeof setActiveSubcategory === 'function') {
      setActiveSubcategory(`all-${itemId}`);
    }
    // 🎯 ТОЧЕЧНЫЙ ФИКС: Ведем на роут каталога, чтобы не ломать и не сбрасывать страницу
    navigate(`/shop/catalog/${itemId}`);
  };

  return (
    <header className="shop-header">
      {/* 🎯 СЕНИОР-ИМПОРТ: Твой родной Топбар встает на самый верх хедера */}
      <ShopTopBar city="Бишкек" />

      <div className="container shop-header-inner shop-header-top-row mt-2">
        {/* Логотип */}
        <Link to="/shop" className="shop-sub-logo-link" onClick={handleLogoClick}>
          <img 
            src="/images/logo.png?v=2" 
            alt="Интернет-магазин" 
            className="shop-logo-img" 
            style={{ maxHeight: '45px', objectFit: 'contain', display: 'block' }} 
          />
        </Link>

        {/* Центр: Инфо-меню и Поиск */}
        <div className="shop-center">
          <nav className="shop-info-menu">
            <NavLink to="/shop/about" className={({ isActive }) => isActive ? 'shop-active' : ''}>О магазине</NavLink>
            <NavLink to="/shop/payment" className={({ isActive }) => isActive ? 'shop-active' : ''}>Оплата</NavLink>
            <NavLink to="/shop/delivery" className={({ isActive }) => isActive ? 'shop-active' : ''}>Доставка</NavLink>
            <NavLink to="/shop/contacts" className={({ isActive }) => isActive ? 'shop-active' : ''}>Контакты</NavLink>
          </nav>
          
          {/* Поиск */}
          <ShopSearchDropdown />
        </div>

        {/* Правая часть: Корзина */}
        <div className="shop-actions">
          <button 
            className="shop-cart btn btn-dark px-3 py-2 rounded-3 text-white fw-medium border-0" 
            onClick={() => navigate('/shop/cart')}
          >
            🛒 Корзина: {totalItems > 0 ? `${totalItems} шт.` : 'пусто'}
          </button>
        </div>
      </div>

      {/* Тёмная строка категорий ровно по ширине баннера */}
      <div className="shop-menu-container">
        <nav className="shop-menu-row shadow-sm">
          <ul className="shop-menu-list mb-0">
            {(menuItems || [])
              .filter(item => item && item.id !== 'all') 
              .map((item) => (
                <li key={item.id} className="shop-menu-item">
                  <button 
                    className={`shop-menu-btn ${activeCategory === item.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(item.id)}
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
