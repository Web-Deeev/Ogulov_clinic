import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Подключаем motion для анимации всей карточки
import { useShop } from './ShopContext'; 
import { QuickOrderModal } from './QuickOrder'; 
import './shopMainDetails.css';

export default function ProductCard({ product }) {
  if (!product) return null;

  const { id, slug_id, title, price, old_price, image, label, formatted_price, formatted_old_price } = product;
  const { addToCart, cart = [], favorites = [], toggleFavorite, updateQuantity } = useShop();

  const [showFastModal, setShowFastModal] = useState(false);

  const cartItem = cart.find((item) => String(item.id) === String(id));
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isProductFavorite = favorites.some((item) => String(item.id) === String(id));

  const cleanPrice = Math.floor(parseFloat(price) || 0);
  const cleanOldPrice = old_price ? Math.floor(parseFloat(old_price)) : null;

  const displayPrice = formatted_price || `${cleanPrice.toLocaleString('ru-RU')} сом`;
  const displayOldPrice = formatted_old_price || (cleanOldPrice ? `${cleanOldPrice.toLocaleString('ru-RU')} сом` : null);

  return (
    /* 🎯 СЕНЬОР-ФИКС: Превратили div в motion.div и добавили упругий ховер-эффект */
    <motion.div 
      className="shop-product-card-container d-flex flex-column h-100 card border-light-subtle shadow-sm rounded-4 p-3" 
      style={{ position: 'relative' }}
      whileHover={{ 
        y: -6, // Плавно приподнимаем карточку вверх на 6px
        scale: 1.01, // Слегка увеличиваем масштаб для эффекта парения
        boxShadow: "0 15px 30px rgba(44, 37, 32, 0.08)" // Наливаем сочной мягкой тенью
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }} // Настройка упругости
    >
      
      {/* Кнопка добавления в Избранное */}
      <button 
        type="button" 
        className="shop-card-favorite-btn position-absolute border-0 bg-transparent p-0" 
        style={{ top: '15px', right: '15px', zIndex: 3, outline: 'none' }} 
        onClick={(e) => { 
          e.preventDefault(); 
          e.stopPropagation();
          if (toggleFavorite) toggleFavorite(product); 
        }}
      >
        <motion.div
          whileTap={{ scale: 1.3 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}
        >
          <svg 
            /* 🎯 СЕНЬОР-ФИКС: Исправили сломанный xmlns адрес */
            xmlns="http://w3.org" 
            viewBox="0 0 24 24" 
            fill={isProductFavorite ? "#dc3545" : "none"} 
            stroke={isProductFavorite ? "#dc3545" : "#70655c"} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ 
              width: '22px', 
              height: '22px', 
              transition: 'stroke 0.2s ease, fill 0.2s ease',
              filter: isProductFavorite ? 'drop-shadow(0 2px 4px rgba(220, 53, 69, 0.2))' : 'none'
            }}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </motion.div>
      </button>

      {/* Бейдж акции */}
      {label && (
        <span className="shop-card-badge position-absolute badge bg-danger text-white px-2 py-1 rounded-2" style={{ top: '15px', left: '15px', zIndex: 3, fontSize: '0.75rem', fontWeight: 'bold' }}>
          {label}
        </span>
      )}

      {/* Изображение товара */}
      <Link to={`/shop/product/${slug_id || id}`} className="shop-card-image-link d-block text-center mb-3 overflow-hidden rounded-3" style={{ height: '200px' }}>
        {/* 🎯 СЕНЬОР-ФИКС: Добавили класс .shop-product-img для плавной анимации картинки */}
        <img src={image || 'https://placeholder.com'} alt={title} className="w-100 h-100 object-fit-cover transition-all img-fluid shop-product-img" />
      </Link>

      {/* Заголовок товара */}
      <Link to={`/shop/product/${slug_id || id}`} className="shop-card-title-link text-decoration-none text-dark fw-bold mb-3 fs-6 d-block" style={{ minHeight: '44px', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {title}
      </Link>

      {/* Блок цен и действий */}
      <div className="shop-bottom-wrapper d-flex flex-column gap-2 mt-auto">
        <div className="shop-price-block d-flex align-items-center justify-content-between w-100">
          <div className="d-flex flex-column">
            <div className="shop-product-current-price fw-bold text-success fs-5">{displayPrice}</div>
            {old_price && <span className="shop-product-old-price text-decoration-line-through text-muted small">{displayOldPrice}</span>}
          </div>

          <div className="shop-action-zone">
            {quantityInCart > 0 ? (
              <div className="shop-card-counter-wrapper d-flex align-items-center border rounded bg-white">
                <button type="button" className="btn btn-sm px-2 py-1 fw-bold text-secondary border-0 bg-transparent" onClick={() => updateQuantity(id, 'decrease')}>−</button>
                <span className="px-2 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{quantityInCart}</span>
                <button type="button" className="btn btn-sm px-2 py-1 fw-bold text-secondary border-0 bg-transparent" onClick={() => updateQuantity(id, 'increase')}>+</button>
              </div>
            ) : (
              <button type="button" className="btn btn-primary d-flex align-items-center gap-2 px-3 py-1.5 rounded-3 text-white fw-semibold" style={{ fontSize: '0.88rem', backgroundColor: '#1a1d20', borderColor: '#1a1d20' }} onClick={() => addToCart(product)} title="Добавить в корзину">
                <span>🛒</span><span>Купить</span>
              </button>
            )}
          </div>
        </div>

        {/* Быстрый заказ */}
        <div className="w-100 text-center mt-1 border-top pt-2">
          <button 
            type="button" 
            className="btn btn-link p-0 text-decoration-none small fw-bold" 
            style={{ color: '#d9a74a', fontSize: '0.82rem' }} 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); 
              setShowFastModal(true);
            }}
          >
            ⚡ Купить в 1 клик
          </button>
        </div>
      </div>

      {showFastModal && (
        <QuickOrderModal 
          id={id} 
          title={title} 
          onClose={() => setShowFastModal(false)} 
        />
      )}

    </motion.div>
  );
}
