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

      {/* Блок фильтра цен */}
      <div className="modern-sidebar-card card-filter-price">
        <div className="modern-sidebar-header">
          <i className="bi bi-sliders icon-green"></i>
          <span className="modern-sidebar-title">Фильтр цен</span>
        </div>
        
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
  );
}
