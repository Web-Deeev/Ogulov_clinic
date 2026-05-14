import { useState } from 'react';


export function ShopTopBar({ city = 'Бишкек', setCurrentView }) {
  return (
    <div className="shop-topbar">
      <div className="container shop-topbar-inner">
        <div>Ваш город: {city}</div>
        <div className="shop-topbar-right">
          <span onClick={() => setCurrentView('cart')} style={{ cursor: 'pointer' }}>Список желаний (0)</span>
          <span onClick={() => setCurrentView('cart')} style={{ cursor: 'pointer', marginLeft: '15px' }}>Личный кабинет</span>
        </div>
      </div>
    </div>
  );
}


export function ShopHeader({ setCurrentView, currentView, totalItems = 0, setActiveCategory, activeCategory }) {
  // Список категорий товаров с добавленным пунктом сброса "Все товары"
  const menuItems = [
    { title: 'Все товары', id: 'all' },
    { title: 'Книги', id: 'knigi' },
    { title: 'Плакаты Огулова А.Т.', id: 'plakati' },
    { title: 'Пищевые добавки/БАД', id: 'bad' },
    { title: 'Микросферы', id: 'microspheres' },
    { title: 'Устройство очистки ПВВК', id: 'pvvk' },
    { title: 'Скребки/Массажеры', id: 'scrapers' },
    { title: 'Банки', id: 'banks' },
    { title: 'Остальные категории', id: 'others' },
  ];

  return (
    <header className="shop-header">
      {/* СТРОКА 1: Основная навигация, Поиск и Корзина */}
      <div className="container shop-header-inner">
        <a 
          href="#shop" 
          className="shop-sub-logo"
          onClick={(e) => { e.preventDefault(); setCurrentView('home'); }}
        >
          Каталог продукции
        </a>

        <div className="shop-center">
          <nav className="shop-info-menu">
            <a 
              href="#about" 
              className={currentView === 'about' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setCurrentView('about'); }}
            >
              О магазине
            </a>
            <a 
              href="#payment" 
              className={currentView === 'payment' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setCurrentView('payment'); }}
            >
              Оплата
            </a>
            <a 
              href="#delivery" 
              className={currentView === 'delivery' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setCurrentView('delivery'); }}
            >
              Доставка
            </a>
            <a 
            href="#contacts" 
            className={currentView === 'contacts' ? 'active-link' : ''}
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('contacts');
            }}
            >
              Контакты
            </a>

          </nav>

          <div className="shop-search">
            <input placeholder="Поиск по товарам..." />
            <button>🔍</button>
          </div>
        </div>

        <div className="shop-actions">
          <button className="shop-cart" onClick={() => setCurrentView('cart')}>
            🛒 Корзина: {totalItems > 0 ? `${totalItems} шт.` : 'пусто'}
          </button>
        </div>
      </div>

      {/* СТРОКА 2: Встроенное меню категорий магазина (ShopMenu) */}
      <nav className="shop-menu-row">
        <div className="container">
          <ul className="shop-menu-list">
            {menuItems.map((item) => (
              <li key={item.id} className="shop-menu-item">
                <button 
                  /* ИСПРАВЛЕНО: Добавлен шаблон строки для динамического класса активности .active */
                  className={`shop-menu-btn ${activeCategory === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('home'); // Принудительно возвращаем на витрину
                    setActiveCategory(item.id); // Фильтруем товары
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
