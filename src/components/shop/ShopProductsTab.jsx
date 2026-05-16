import React, { useState } from 'react';
import { useShop } from './ShopContext'; 
import { productsData } from './shopData.js'; 
import ShopProductCards from './ShopProductCards'; 
import ShopBanner from "./ShopBanner"; 
import './shop.css'; 



export default function ShopProductsTab() {
  const [activeTab, setActiveTab] = useState('hits');
  const [sortOrder, setSortOrder] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Забираем данные и стейты из глобального контекста магазина
  const { 
    addToCart, 
    favorites = [], 
    setFavorites, 
    activeCategory, 
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory, 
    searchQuery, 
    menuItems 
  } = useShop();

  // Функция добавления/удаления из избранного
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === product.id);
      if (exists) return prev.filter((fav) => fav.id !== product.id);
      return [...prev, product];
    });
  };

  // Очистка строки цены для математических сравнений
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseInt(priceStr.toString().replace(/[^0-9]/g, ''), 10) || 0;
  };

  // Фильтрация товаров для табов НА ГЛАВНОЙ странице
  const getProductsForMainLanding = () => {
    if (activeTab === 'news') {
      return productsData.filter(p => p.is_new === true); 
    }
    if (activeTab === 'sales') {
      return productsData.filter(p => p.oldPrice !== null && p.oldPrice !== undefined);
    }
    return productsData.filter(p => p.is_hit === true);
  };

  // Основной конвейер обработки данных (фильтры + сортировка)
  const processProducts = () => {
    let result = [];

    // 1. Разделяем главную страницу и внутренние категории
    if (activeCategory === 'all') {
      result = getProductsForMainLanding();
    } else {
      result = productsData.filter(product => product.category === activeCategory);
      
      // Дополнительный фильтр по подкатегории
      if (activeSubcategory && !activeSubcategory.startsWith('all')) {
        result = result.filter(product => product.subcategory === activeSubcategory);
      }
    }

    // 2. Поисковый фильтр
    if (searchQuery) {
      result = result.filter(product => 
        product.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 3. Фильтр цен "от"
    if (minPrice) {
      result = result.filter(product => parsePrice(product.price) >= parseInt(minPrice, 10));
    }

    // 4. Фильтр цен "до"
    if (maxPrice) {
      result = result.filter(product => parsePrice(product.price) <= parseInt(maxPrice, 10));
    }

    // 5. Сортировка стоимости
    if (sortOrder === 'low-to-high') {
      return [...result].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    }
    if (sortOrder === 'high-to-low') {
      return [...result].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    return result;
  };

  const currentProducts = processProducts();
  const isMainLanding = activeCategory === 'all';

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (setActiveSubcategory) {
      setActiveSubcategory(`all-${categoryId}`);
    }
  };

  return (
    <div className="container my-4">
      {/* Баннер всегда виден на главной */}
      {isMainLanding && <ShopBanner />} 

      {/* ШАБЛОН ШАПКИ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ */}
      {isMainLanding && (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4 border-bottom pb-3 mt-4">
          <ul className="nav nav-tabs border-bottom-0 mb-0">
            {['hits', 'news', 'sales'].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link fs-5 fw-bold px-3 py-2 border-0 bg-transparent ${activeTab === tab ? 'text-danger border-bottom border-3 border-danger' : 'text-secondary'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'hits' ? 'Хиты продаж' : tab === 'news' ? 'Новинки' : 'Акции'}
                </button>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-2" style={{ minWidth: '220px' }}>
            <label className="text-nowrap small text-secondary fw-semibold mb-0">Сортировка:</label>
            <select className="form-select form-select-sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">По умолчанию</option>
              <option value="low-to-high">Сначала дешевые</option>
              <option value="high-to-low">Сначала дорогие</option>
            </select>
          </div>
        </div>
      )}

      {/* ШАБЛОН ШАПКИ ДЛЯ СТРАНИЦ КАТЕГОРИЙ */}
      {!isMainLanding && (
        <div className="d-flex justify-content-end mb-4 pt-2">
          <div className="d-flex align-items-center gap-2" style={{ width: '220px' }}>
            <select className="form-select form-select-sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">По умолчанию</option>
              <option value="low-to-high">Сначала дешевые</option>
              <option value="high-to-low">Сначала дорогие</option>
            </select>
          </div>
        </div>
      )}

      <div className="row">
        {/* СОВРЕМЕННЫЙ САЙДБАР СЛЕВА: Появляется строго внутри категорий */}
        {!isMainLanding && (
          <div className="col-lg-3 col-md-4 mb-4">
            
            {/* Блок категорий каталога */}
            <div className="modern-sidebar-card card-categories mb-4">
              <div className="modern-sidebar-header">
                <i className="bi bi-collection icon-green"></i>
                <span className="modern-sidebar-title">Каталог</span>
              </div>

              <div className="modern-menu-list">
                {/* Кнопка сброса для возврата на главную */}
                <button className="btn-modern-back" onClick={() => handleCategoryClick('all')}>
                  <i className="bi bi-arrow-left-short"></i>
                  <span>Главная магазина</span>
                </button>

                {/* Генерация списка категорий */}
                {menuItems.map((item) => {
                  const isCurrentActive = activeCategory === item.id;
                  return (
                    <div key={item.id} className="modern-menu-wrapper">
                      <button
                        className={`btn-modern-menu-item ${isCurrentActive ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(item.id)}
                      >
                        <span>{item.title}</span>
                        <i className={`bi bi-chevron-right arrow-indicator ${isCurrentActive ? 'rotated' : ''}`}></i>
                      </button>

                      {/* Вложенные подкатегории */}
                      {isCurrentActive && item.subcategories && item.subcategories.length > 0 && (
                        <div className="modern-sub-list">
                          <div className="modern-sub-line"></div>
                          {item.subcategories.map((sub) => {
                            const isSubActive = activeSubcategory === sub.id;
                            return (
                              <button
                                key={sub.id}
                                className={`btn-modern-sub-item ${isSubActive ? 'active' : ''}`}
                                onClick={() => setActiveSubcategory && setActiveSubcategory(sub.id)}
                              >
                                {sub.title}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Блок фильтра цен: Ячейки сверху, ОДИН ползунок снизу */}
            <div className="modern-sidebar-card card-filter-price">
              <div className="modern-sidebar-header">
                <i className="bi bi-sliders icon-green"></i>
                <span className="modern-sidebar-title">Фильтр цен</span>
              </div>
              
              {/* 1. Ячейки ввода цен сверху */}
              <div className="modern-price-inputs mb-3">
                <div className="modern-field-group">
                  <span className="modern-field-label">от</span>
                  <input 
                    type="number" 
                    className="form-control modern-price-field" 
                    placeholder="0" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(e.target.value)} 
                  />
                </div>
                <span className="modern-price-separator">—</span>
                <div className="modern-field-group">
                  <span className="modern-field-label">до</span>
                  <input 
                    type="number" 
                    className="form-control modern-price-field" 
                    placeholder="20 000" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)} 
                  />
                </div>
              </div>

              {/* 2. Один ползунок регулировки максимальной цены */}
              <div className="single-slider-container mb-2">
                <input 
                  type="range" 
                  min="0" 
                  max="20000" 
                  step="100"
                  value={maxPrice || 20000} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMaxPrice(val === 20000 ? '' : val.toString());
                  }} 
                  className="form-range modern-single-range"
                />
                <div className="d-flex justify-content-between text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                  <span>0 сом</span>
                  <span>до: {maxPrice ? `${Number(maxPrice).toLocaleString('ru-RU')} сом` : '20 000+ сом'}</span>
                </div>
              </div>
              
              {(minPrice || maxPrice) && (
                <button 
                  className="btn btn-sm btn-light btn-modern-clear mt-2" 
                  onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                >
                  Сбросить фильтр
                </button>
              )}
            </div>

          </div>
        )}

        {/* СЕТКА С КАРТОЧКАМИ ТОВАРОВ */}
        <div className={isMainLanding ? "col-12" : "col-lg-9 col-md-8"}>
          {currentProducts.length === 0 ? (
            <div className="text-center my-5 py-5 text-muted bg-white rounded border shadow-sm">
              <h5>Товары не найдены</h5>
              <p className="small text-secondary mb-0">В данной секции каталога товаров пока нет.</p>
            </div>
          ) : (
            <div className={`row row-cols-1 row-cols-sm-2 ${isMainLanding ? 'row-cols-md-3 row-cols-lg-4' : 'row-cols-md-2 row-cols-lg-3'} g-4`}>
              {currentProducts.map((product) => {
                const isFavorite = favorites.some((fav) => fav.id === product.id);
                return (
                  <div key={product.id} className="col">
                    <ShopProductCards 
                      product={product} 
                      onBuyClick={addToCart} 
                      onFavoriteClick={toggleFavorite} 
                      isFavorite={isFavorite} 
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
