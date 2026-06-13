// src/components/common/shop/ShopHeader/ShopSearchDropdown.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 🚀 ВАЖНО: Исправили путь к контексту магазина с учетом локации в common/shop/
import { useShop } from '../../shop/ShopMainDetails/ShopContext';

export default function ShopSearchDropdown() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, setActiveCategory, productsData = [] } = useShop();
  
  // Изолируем быстрый ввод пользователя в локальный стейт, чтобы не триггерить глобальный контекст
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  // Синхронизируем локальный стейт, если глобальный запрос изменился извне (например, сброс по клику на логотип)
  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  // ⏱️ DEBOUNCE EFFECT: Обновляем глобальный поиск только через 300мс после того, как пользователь закончил ввод
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof setSearchQuery === 'function') {
        setSearchQuery(localQuery);
      }
    }, 300);

    return () => clearTimeout(timer); // Сбрасываем таймер при каждом новом вводе символа
  }, [localQuery, setSearchQuery]);

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

  // 🛡️ useMemo + Null-safety: Фильтруем боевые товары из Django без лишних перерасчетов
  const liveSearchResults = useMemo(() => {
    const query = localQuery?.trim()?.toLowerCase();
    if (!query || !Array.isArray(productsData)) return [];

    return productsData.filter(product => 
      product && product.title?.toLowerCase().includes(query)
    );
  }, [localQuery, productsData]);

  const handleInputSubmit = () => {
    setIsFocused(false);
    if (setActiveCategory) {
      setActiveCategory('all'); 
    }
    if (typeof setSearchQuery === 'function') {
      setSearchQuery(localQuery);
    }
    navigate('/shop');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    if (typeof setSearchQuery === 'function') {
      setSearchQuery('');
    }
  };

  return (
    <div className="shop-search position-relative" ref={searchRef} style={{ zIndex: 1050 }}>
      <input 
        placeholder="Поиск по товарам..." 
        value={localQuery} 
        onChange={(e) => setLocalQuery(e.target.value)} 
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        className="form-control"
      />
      <button type="button" onClick={handleInputSubmit} className="btn-search">🔍</button>

      {/* Окно результатов быстрого превью */}
      {isFocused && localQuery && localQuery.trim() !== '' && (
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
              onClick={handleClearSearch}
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
                Ничего не найдено по запросу "{localQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
