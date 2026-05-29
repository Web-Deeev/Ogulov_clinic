import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { useShop } from '../ShopMainDetails/ShopContext'; 
import { filterAndSortProducts } from './shopHelpers.js'; 
import ShopSidebar from './ShopSidebar'; 
import ShopBanner from "../ShopHeader/ShopBanner"; 

// ЖЕЛЕЗОБЕТОННЫЙ ФИКС ИМПОРТА: Подтягиваем карточку по её реальному имени на диске
import ProductCard from '../ShopMainDetails/ShopProductCards'; 

/* Модульные CSS-файлы */
import './shopProduct.css';            
import '../ShopMainDetails/shopMainDetails.css'; 

export default function ShopProductsTab() {
  const { categorySlug } = useParams(); // Извлекаем динамический slug категории из URL
  
  // 🟢 КИСС-РЕФАКТОРИНГ: Полностью убрали локальный стейт activeTab
  const [sortOrder, setSortOrder] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Вытаскиваем динамический массив товаров с бэкенда Django из контекста ядра
  const { 
    productsData = [],
    isProductsLoading,
    productsError,
    activeCategory, 
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory, 
    searchQuery, 
    menuItems 
  } = useShop();

  const isSearchMode = searchQuery && searchQuery.trim() !== '';
  const isMainLanding = activeCategory === 'all' && !isSearchMode;

  const currentParentCategory = menuItems?.find(item => item.id === activeCategory);
  const hasSubcategories = currentParentCategory && currentParentCategory.subcategories?.length > 0;

  // СИНХРОНИЗАЦИЯ URL С КОНТЕКСТОМ КАТАЛОГА
  useEffect(() => {
    if (categorySlug) {
      setActiveCategory(categorySlug);
    } else {
      setActiveCategory('all'); 
    }
  }, [categorySlug, setActiveCategory]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (setActiveSubcategory) {
      setActiveSubcategory(`all-${categoryId}`);
    }
  };

  // 🛡️ СЕНЬОР-ФИЛЬТРАЦИЯ: Разделяем продукты на 3 независимых потока для вывода списком на главной
  const hitProducts = filterAndSortProducts({
    products: productsData || [], activeCategory, activeSubcategory,
    activeTab: 'hits', searchQuery, minPrice, maxPrice, sortOrder, isSearchMode
  });

  const newProducts = filterAndSortProducts({
    products: productsData || [], activeCategory, activeSubcategory,
    activeTab: 'news', searchQuery, minPrice, maxPrice, sortOrder, isSearchMode
  });

  const saleProducts = filterAndSortProducts({
    products: productsData || [], activeCategory, activeSubcategory,
    activeTab: 'sales', searchQuery, minPrice, maxPrice, sortOrder, isSearchMode
  });

  // Базовый поток продуктов для режима категорий/поиска
  const currentProducts = filterAndSortProducts({
    products: productsData || [], activeCategory, activeSubcategory,
    activeTab: 'all', searchQuery, minPrice, maxPrice, sortOrder, isSearchMode
  });

  // --- ОБРАБОТКА СЕТЕВЫХ СОСТОЯНИЙ ЗАГРУЗКИ ---
  if (isProductsLoading) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <h5 className="mt-3 text-secondary fw-semibold">Загрузка каталога Огулова...</h5>
        <p className="text-muted small">Получаем данные из Django REST Framework</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center shadow-sm rounded-4 py-4" role="alert">
          <h5 className="fw-bold">Ошибка синхронизации данных</h5>
          <p className="mb-0 text-secondary small">{productsError}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="container my-4">
      {isMainLanding && <ShopBanner />} 

      {/* 🟢 КИСС-РЕФАКТОРИНГ ХЕДЕРА: Табы удалены, на главной выводится только селектор сортировки */}
      {isMainLanding && (
        <div className="d-flex justify-content-end align-items-center mb-4 border-bottom pb-3 mt-4">
          <div className="d-flex align-items-center gap-2" style={{ minWidth: '220px' }}>
            <label className="text-nowrap small text-secondary fw-semibold mb-0">Сортировка всего каталога:</label>
            <select className="form-select form-select-sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">По умолчанию</option>
              <option value="low-to-high">Сначала дешевые</option>
              <option value="high-to-low">Сначала дорогие</option>
            </select>
          </div>
        </div>
      )}

      {/* Шапка для режима поиска или просмотра конкретной категории */}
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

      {/* =========================================================================
          🎯 СЦЕНАРИЙ 1: ГЛАВНАЯ СТРАНИЦА — ВСЕ ТРИ СЕКЦИИ ВЕРТИКАЛЬНЫМ СПИСКОМ
          ========================================================================= */}
      {isMainLanding ? (
        <div className="home-product-sections-list">
          
          {/* СЕКЦИЯ 1: ХИТЫ ПРОДАЖ */}
          <div className="mb-5">
            <h3 className="fw-bold mb-3 pb-2 text-dark position-relative" style={{ borderBottom: '2px solid #ffc107', display: 'inline-block' }}>
              🔥 Хиты продаж
            </h3>
            {hitProducts.length === 0 ? (
              <p className="text-muted small">В этой категории пока нет товаров.</p>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {hitProducts.map(item => item && (
                  <div className="col d-flex align-items-stretch" key={`hit-${item.id}`}>
                    <ProductCard product={item} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* СЕКЦИЯ 2: НОВИНКИ */}
          <div className="mb-5">
            <h3 className="fw-bold mb-3 pb-2 text-dark position-relative" style={{ borderBottom: '2px solid #ffc107', display: 'inline-block' }}>
              ✨ Рекомендуемые и Новинки
            </h3>
            {newProducts.length === 0 ? (
              <p className="text-muted small">В этой категории пока нет товаров.</p>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {newProducts.map(item => item && (
                  <div className="col d-flex align-items-stretch" key={`new-${item.id}`}>
                    <ProductCard product={item} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* СЕКЦИЯ 3: АКЦИИ И СКИДКИ */}
          <div className="mb-5">
            <h3 className="fw-bold mb-3 pb-2 text-dark position-relative" style={{ borderBottom: '2px solid #ffc107', display: 'inline-block' }}>
              ⚡ Специальные предложения и Акции
            </h3>
            {saleProducts.length === 0 ? (
              <p className="text-muted small">В этой категории пока нет активных акций.</p>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {saleProducts.map(item => item && (
                  <div className="col d-flex align-items-stretch" key={`sale-${item.id}`}>
                    <ProductCard product={item} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* =========================================================================
            🎯 СЦЕНАРИЙ 2: СТАНДАРТНЫЙ РЕЖИМ РАЗДЕЛА КАТЕГОРИЙ ИЛИ ПОИСКА
            ========================================================================= */
        <div className="row">
          {/* Боковой сайдбар */}
          {!isSearchMode && (
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

          {/* Сетка результатов */}
          <div className={isSearchMode ? "col-12" : "col-lg-9 col-md-8"}>
            
            {/* Окошки подкатегорий (БАДы и пр.) */}
            {!isSearchMode && hasSubcategories && (
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
                        activeSubcategory === sub.id ? 'border-primary bg-primary bg-opacity-10 shadow-sm fw-bold' : 'bg-white border-light-subtle'
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

            {/* Вывод карточек */}
            {currentProducts.length === 0 ? (
              <div className="text-center my-5 py-5 text-muted bg-white rounded border shadow-sm">
                <h5>Товары не найдены</h5>
                <p className="small text-secondary mb-0">Попробуйте изменить параметры фильтров.</p>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {currentProducts.map((item) => item && (
                  <div className="col d-flex align-items-stretch" key={item.id || item.slug_id}>
                    <ProductCard product={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
