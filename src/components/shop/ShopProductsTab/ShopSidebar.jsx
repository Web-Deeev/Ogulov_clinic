import React from 'react';
import './shopProduct.css'; 

export default function ShopSidebar({
  menuItems,
  activeCategory,
  activeSubcategory,
  setActiveSubcategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onCategoryClick
}) {
  return (
    <div className="col-lg-3 col-md-4 mb-4">
      {/* Блок категорий каталога */}
      <div className="modern-sidebar-card card-categories mb-4">
        <div className="modern-sidebar-header">
          <i className="bi bi-collection icon-green"></i>
          <span className="modern-sidebar-title">Каталог</span>
        </div>

        <div className="modern-menu-list">
          <button className="btn-modern-back" onClick={() => onCategoryClick('all')}>
            <i className="bi bi-arrow-left-short"></i>
            <span>Главная магазина</span>
          </button>

          {menuItems.map((item) => {
            const isCurrentActive = activeCategory === item.id;
            return (
              <div key={item.id} className="modern-menu-wrapper">
                <button
                  className={`btn-modern-menu-item ${isCurrentActive ? 'active' : ''}`}
                  onClick={() => onCategoryClick(item.id)}
                >
                  <span>{item.title}</span>
                  <i className={`bi bi-chevron-right arrow-indicator ${isCurrentActive ? 'rotated' : ''}`}></i>
                </button>

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

      {/* Блок фильтра цен (Чистый интерфейс без полей ввода) */}
      <div className="modern-sidebar-card card-filter-price">
        <div className="modern-sidebar-header mb-3">
          <i className="bi bi-sliders icon-green"></i>
          <span className="modern-sidebar-title">Фильтр цен</span>
        </div>

        <div className="single-slider-container mb-2">
          <input 
            type="range" 
            min="0" 
            max="20000" 
            step="100"
            value={maxPrice === '' ? 20000 : Math.max(0, Number(maxPrice))} 
            onChange={(e) => {
              const val = Number(e.target.value);
              // Защита от минуса на всякий случай и сохранение логики 20 000+
              const safeVal = Math.max(0, val);
              setMaxPrice(safeVal === 20000 ? '' : safeVal.toString());
            }} 
            className="form-range modern-single-range"
          />
          {/* Информативный нижний счётчик */}
          <div className="d-flex justify-content-between text-muted mt-2" style={{ fontSize: '0.85rem' }}>
            <span>0 сом</span>
            <span className="fw-bold text-success">
              до: {maxPrice ? `${Math.max(0, Number(maxPrice)).toLocaleString('ru-RU')} сом` : '20 000+ сом'}
            </span>
          </div>
        </div>
        
        {(minPrice || maxPrice) && (
          <button 
            className="btn btn-sm btn-light btn-modern-clear mt-3 w-100" 
            onClick={() => { setMinPrice(''); setMaxPrice(''); }}
          >
            Сбросить фильтр
          </button>
        )}
      </div>
    </div>
  );
}
