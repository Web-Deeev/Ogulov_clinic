import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useShop } from './ShopContext';
// Импортируем общую базу товаров, чтобы шапка знала, в каких категориях есть товары
import { productsData } from './shopData.js'; 

export function ShopTopBar({ city = 'Бишкек' }) {
  const { favorites = [] } = useShop();
  return (
    <div className="shop-topbar">
      <div className="container shop-topbar-inner">
        <div>Ваш город: {city}</div>
        <div className="shop-topbar-right">
          <Link to="/shop/wishlist" style={{ textDecoration: 'none', color: 'inherit' }}>
            Список желаний ({favorites.length})
          </Link>
          <Link to="/shop/profile" style={{ marginLeft: '15px', textDecoration: 'none', color: 'inherit' }}>
            Личный кабинет
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ShopHeader() {
  const navigate = useNavigate();
  
  // Достаем методы управления и данные из нашего глобального контекста
  const { 
    activeCategory, 
    setActiveCategory, 
    setActiveSubcategory, // Забираем метод сброса подкатегорий
    searchQuery, 
    setSearchQuery, 
    cart = [], 
    menuItems 
  } = useShop();

  // Вычисляем общее количество штук товаров в корзине
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <header className="shop-header">
      <div className="container shop-header-inner shop-header-top-row">
        {/* Логотип при клике сбрасывает категорию на 'all', возвращая на главную витрину */}
        <Link to="/shop" className="shop-sub-logo-link" onClick={() => setActiveCategory('all')}>
          <img src="/images/logo.png?v=2" alt="Интернет-магазин" className="shop-logo-img" style={{ maxHeight: '45px', objectFit: 'contain', display: 'block' }} />
        </Link>

        <div className="shop-center">
          <nav className="shop-info-menu">
            <NavLink to="/shop/about" className={({ isActive }) => isActive ? 'active' : ''}>О магазине</NavLink>
            <NavLink to="/shop/payment" className={({ isActive }) => isActive ? 'active' : ''}>Оплата</NavLink>
            <NavLink to="/shop/delivery" className={({ isActive }) => isActive ? 'active-link' : ''}>Доставка</NavLink>
            <NavLink to="/shop/contacts" className={({ isActive }) => isActive ? 'active-link' : ''}>Контакты</NavLink>
          </nav>
          <div className="shop-search">
            <input placeholder="Поиск по товарам..." value={searchQuery || ''} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="button">🔍</button>
          </div>
        </div>

        <div className="shop-actions">
          <button className="shop-cart" onClick={() => navigate('/shop/cart')}>
            🛒 Корзина: {totalItems > 0 ? `${totalItems} шт.` : 'пусто'}
          </button>
        </div>
      </div>

{/* Желтая строка категорий — ВСЕ разделы из контекста, начиная с Книг */}
      <nav className="shop-menu-row">
        <div className="container">
          <ul className="shop-menu-list">
            {menuItems
              // Оставляем ТОЛЬКО этот фильтр — он убирает "Все товары" (если он есть в массиве)
              .filter(item => item.id !== 'all') 
              // Напрямую рендерим абсолютно все элементы без скрытия
              .map((item) => (
                <li key={item.id} className="shop-menu-item">
                  <button 
                    className={`shop-menu-btn ${activeCategory === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCategory(item.id); 
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
        </div>
      </nav>
    </header>
  );
}
