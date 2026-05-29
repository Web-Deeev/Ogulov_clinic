import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../ShopMainDetails/ShopContext';

export default function ShopSearchDropdown() {
  const navigate = useNavigate();
  
  // 🟢 ИСПРАВЛЕНО: Достаем реальный массив товаров productsData напрямую из Django через контекст!
  // ❌ УДАЛЕН битый импорт файла shopData.js, который вызывал рассинхронизацию и мерцание модалки
  const { searchQuery, setSearchQuery, setActiveCategory, productsData = [] } = useShop();
  
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  // Клик вне зоны поиска закрывает окно подсказок
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🟢 ИСПРАВЛЕНО: Фильтруем боевые товары из Джанги по названию или артикулу
  const liveSearchResults = !searchQuery || searchQuery.trim() === ''
    ? []
    : productsData.filter(product => 
        product && product.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleInputSubmit = () => {
    setIsFocused(false);
    if (setActiveCategory) {
      setActiveCategory('all'); 
    }
    navigate('/shop');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };
  return (
    <div className="shop-search position-relative" ref={searchRef} style={{ zIndex: 1050 }}>
      <input 
        placeholder="Поиск по товарам..." 
        value={searchQuery || ''} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" onClick={handleInputSubmit}>🔍</button>

      {/* Окно результатов быстрого превью */}
      {isFocused && searchQuery && searchQuery.trim() !== '' && (
        <div 
          className="position-absolute w-100 bg-white mt-1 rounded shadow border border-light-subtle overflow-hidden text-start d-flex flex-column"
          style={{ top: '100%', left: 0, minWidth: '320px', maxHeight: '340px' }}
        >
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom bg-light">
            <span className="text-secondary small fw-semibold">Быстрые результаты ({liveSearchResults.length})</span>
            <button 
              type="button" 
              className="btn-close p-0 border-0 bg-transparent text-secondary" 
              style={{ fontSize: '14px', lineHeight: 1, cursor: 'pointer' }}
              onClick={() => setSearchQuery('')}
              title="Очистить поиск"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto flex-grow-1" style={{ maxHeight: '280px' }}>
            {liveSearchResults.length > 0 ? (
              <div className="d-flex flex-column">
                {liveSearchResults.map(product => {
                  if (!product) return null;
                  
                  // Безопасно вытаскиваем цены и slug_id из боевой DRF-структуры
                  const prodId = product.slug_id || product.id;
                  const displayPrice = product.formatted_price || `${Math.floor(parseFloat(product.price) || 0).toLocaleString('ru-RU')} сом`;

                  return (
                    <Link
                      key={product.id}
                      to={`/shop/product/${prodId}`}
                      onClick={() => setIsFocused(false)}
                      className="d-flex align-items-center gap-3 p-2 text-decoration-none text-dark border-bottom border-light-subtle search-item-hover"
                      style={{ transition: 'background-color 0.2s' }}
                    >
                      <img 
                        src={product.image || 'https://placeholder.com'} 
                        alt={product.title} 
                        style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }} 
                      />
                      <div className="overflow-hidden">
                        <div className="fw-medium small text-truncate text-dark">{product.title}</div>
                        <div className="text-success small fw-bold">{displayPrice}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-muted small">
                Ничего не найдено по запросу "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
