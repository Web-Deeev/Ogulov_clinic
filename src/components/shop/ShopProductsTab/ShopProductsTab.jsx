import React, { useState } from 'react';
import { useShop } from '../ShopMainDetails/ShopContext'; 
import { productsData } from '../ShopMainDetails/shopData.js'; // ОСТАЛСЯ ТОЛЬКО ОДИН ЧИСТЫЙ ИМПОРТ
import { filterAndSortProducts } from './shopHelpers.js'; 
import ShopSidebar from './ShopSidebar'; 

/* Модульные CSS-файлы */
import './shopProduct.css';            /* Стили для сайдбара и таборов фильтров */
import '../ShopMainDetails/shopMainDetails.css'; /* Стили для отображения самих карточек товаров */

import ShopProductCards from '../ShopMainDetails/ShopProductCards'; 
import ShopBanner from "../ShopHeader/ShopBanner"; 

export default function ShopProductsTab() {
  const [activeTab, setActiveTab] = useState('hits');
  const [sortOrder, setSortOrder] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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

  const isSearchMode = searchQuery && searchQuery.trim() !== '';
  const isMainLanding = activeCategory === 'all' && !isSearchMode;

  // Находим текущую активную родительскую категорию в меню для проверки подкатегорий
  const currentParentCategory = menuItems?.find(item => item.id === activeCategory);
  const hasSubcategories = currentParentCategory && currentParentCategory.subcategories?.length > 0;

  // Избранное
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === product.id);
      if (exists) return prev.filter((fav) => fav.id !== product.id);
      return [...prev, product];
    });
  };

  // Переключение категории
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (setActiveSubcategory) {
      setActiveSubcategory(`all-${categoryId}`);
    }
  };

  // Вызываем функцию конвейера фильтров
  const currentProducts = filterAndSortProducts({
    products: productsData,
    activeCategory,
    activeSubcategory,
    activeTab,
    searchQuery,
    minPrice,
    maxPrice,
    sortOrder,
    isSearchMode
  });

  return (
    <div className="container my-4">
      {isMainLanding && <ShopBanner />} 

      {/* ХЕДЕР ГЛАВНОЙ СТРАНИЦЫ */}
      {isMainLanding && (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4 border-bottom pb-3 mt-4">
          <ul className="nav nav-tabs border-bottom-0 mb-0">
            {['hits', 'news', 'sales'].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link fs-5 fw-bold px-3 py-2 border-0 bg-transparent ${
                    activeTab === tab 
                      ? 'border-bottom border-3' 
                      : 'text-secondary'
                  }`}
                  style={activeTab === tab ? { color: '#d9a74a', borderColor: '#d9a74a' } : {}}
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

      {/* ХЕДЕР СТРАНИЦ КАТЕГОРИЙ И ПОИСКА */}
      {!isMainLanding && (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pt-2 border-bottom pb-3">
          <div>
            <h4 className="fw-bold mb-0 text-dark">
              {isSearchMode ? `Результаты поиска по запросу: "${searchQuery}"` : currentParentCategory?.title || 'Каталог товаров'}
              <small className="text-muted fs-6 d-block mt-1">Найдено товаров: {currentProducts.length}</small>
            </h4>
          </div>
          <div className="d-flex align-items-center gap-2" style={{ width: '220px' }}>
            <label className="text-nowrap small text-secondary fw-semibold mb-0">Сортировка:</label>
            <select className="form-select form-select-sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">По умолчанию</option>
              <option value="low-to-high">Сначала дешевые</option>
              <option value="high-to-low">Сначала дорогие</option>
            </select>
          </div>
        </div>
      )}

      <div className="row">
        {/* ИСПОЛЬЗУЕМ ВЫНЕСЕННЫЙ КОМПОНЕНТ САЙДБАРА */}
        {!isMainLanding && !isSearchMode && (
          <ShopSidebar 
            menuItems={menuItems}
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
            setActiveSubcategory={setActiveSubcategory}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onCategoryClick={handleCategoryClick}
          />
        )}

        {/* СЕТКА С КАРТОЧКАМИ ТОВАРОВ И ПЛИТКАМИ-ОКОШКАМИ */}
        <div className={(isMainLanding || isSearchMode) ? "col-12" : "col-lg-9 col-md-8"}>
          
          {/* Динамические окошки подкатегорий (выводятся только в БАДах) */}
          {!isMainLanding && !isSearchMode && hasSubcategories && (
            <div className="row row-cols-2 row-cols-sm-3 row-cols-lg-4 g-2 mb-4">
              <div className="col">
                <div 
                  className={`card text-center p-3 h-100 border transition-all ${
                    activeSubcategory === 'all' || activeSubcategory === `all-${activeCategory}`
                      ? 'border-primary bg-primary bg-opacity-10 shadow-sm fw-bold' 
                      : 'bg-white border-light-subtle'
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveSubcategory(`all-${activeCategory}`)}
                >
                  <div className="card-body d-flex align-items-center justify-content-center p-0">
                    <span className={activeSubcategory === 'all' || activeSubcategory === `all-${activeCategory}` ? 'text-primary' : 'text-dark'}>
                      Все товары раздела
                    </span>
                  </div>
                </div>
              </div>

              {currentParentCategory.subcategories.map((sub) => (
                <div className="col" key={sub.id}>
                  <div 
                    className={`card text-center p-3 h-100 border transition-all ${
                      activeSubcategory === sub.id 
                        ? 'border-primary bg-primary bg-opacity-10 shadow-sm fw-bold' 
                        : 'bg-white border-light-subtle'
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActiveSubcategory(sub.id)}
                  >
                    <div className="card-body d-flex align-items-center justify-content-center p-0">
                      <span className={activeSubcategory === sub.id ? 'text-primary' : 'text-dark'}>
                        {sub.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ВЫВОД КАРТОЧЕК */}
          {currentProducts.length === 0 ? (
            <div className="text-center my-5 py-5 text-muted bg-white rounded border shadow-sm">
              <h5>Товары не найдены</h5>
              <p className="small text-secondary mb-0">Попробуйте изменить фильтры или текст поиска.</p>
            </div>
          ) : (
            <div className={`row row-cols-1 row-cols-sm-2 ${(isMainLanding || isSearchMode) ? 'row-cols-md-3 row-cols-lg-4' : 'row-cols-md-2 row-cols-lg-3'} g-4`}>
              {currentProducts.map((product) => {
                return (
                  <div key={product.id} className="col">
                    <ShopProductCards product={product} />
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
