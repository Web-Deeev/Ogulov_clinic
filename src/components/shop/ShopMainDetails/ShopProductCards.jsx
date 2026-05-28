import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from './ShopContext'; 
// 🎯 Импортируем нашу чистую изолированную модалку
import { QuickOrderModal } from './QuickOrder'; 
import api from '@/api/shopService';
import './shopMainDetails.css';

export default function ProductCard({ product }) {
  if (!product) return null;

  const { id, slug_id, title, price, old_price, image, label, formatted_price, formatted_old_price } = product;
  const { addToCart, cart = [], favorites = [], toggleFavorite, updateQuantity } = useShop();

  // В карточке остается ОДИН ЕДИНСТВЕННЫЙ стейт — просто флаг: открыто окно или закрыто
  const [showFastModal, setShowFastModal] = useState(false);

  const cartItem = cart.find((item) => String(item.id) === String(id));
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isProductFavorite = favorites.some((item) => String(item.id) === String(id));

  const displayPrice = formatted_price || `${price} сом`;
  const displayOldPrice = formatted_old_price || (old_price ? `${old_price} сом` : null);

  return (
    <div className="shop-product-card-container d-flex flex-column h-100 card border-light-subtle shadow-sm rounded-4 p-3" style={{ position: 'relative' }}>
      
      <button type="button" className="shop-card-favorite-btn position-absolute border-0 bg-transparent" style={{ top: '15px', right: '15px', zIndex: 3, outline: 'none' }} onClick={(e) => { e.preventDefault(); if (toggleFavorite) toggleFavorite(product); }}>
        <span style={{ fontSize: '1.3rem', cursor: 'pointer' }}>{isProductFavorite ? '❤️' : '🤍'}</span>
      </button>

      {label && <span className="shop-card-badge position-absolute badge bg-danger text-white px-2 py-1 rounded-2" style={{ top: '15px', left: '15px', zIndex: 3, fontSize: '0.75rem', fontWeight: 'bold' }}>{label}</span>}

      <Link to={`/shop/product/${slug_id || id}`} className="shop-card-image-link d-block text-center mb-3 overflow-hidden rounded-3" style={{ height: '200px' }}>
        <img src={image || 'https://placeholder.com'} alt={title} className="w-100 h-100 object-fit-cover transition-all img-fluid" />
      </Link>

      <Link to={`/shop/product/${slug_id || id}`} className="shop-card-title-link text-decoration-none text-dark fw-bold mb-3 fs-6 d-block" style={{ minHeight: '44px', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {title}
      </Link>

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
              <button type="button" className="btn btn-primary d-flex align-items-center gap-2 px-3 py-1.5 rounded-3 text-white fw-semibold" style={{ fontSize: '0.88rem' }} onClick={() => addToCart(product)} title="Добавить в корзину">
                <span>🛒</span><span>Купить</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-100 text-center mt-1 border-top pt-2">
          <button type="button" className="btn btn-link p-0 text-decoration-none small fw-bold" style={{ color: '#d9a74a', fontSize: '0.82rem' }} onClick={() => setShowFastModal(true)}>
            ⚡ Купить в 1 клик
          </button>
        </div>
      </div>

      {/* 🎯 ПОДКЛЮЧАЕМ НАШ ВЫНЕСЕННЫЙ КОМПОНЕНТ МОДАЛКИ (Чистота и DRY) */}
      {showFastModal && (
        <QuickOrderModal 
          id={id} 
          title={title} 
          onClose={() => setShowFastModal(false)} 
        />
      )}

    </div>
  );
}
