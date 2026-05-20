import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from './ShopContext'; 

/* ИСПРАВЛЕНО: Подключаем правильный модульный файл стилей маленькими буквами */
import './shopMainDetails.css';

export default function ProductCard({ product }) {
  const { id, title, price, oldPrice, image, label } = product;
  
  // Достаем методы корзины и избранного из твоего глобального контекста
  const { addToCart, cart = [], favorites = [], toggleFavorite, updateQuantity } = useShop();

  // Находим, добавлен ли этот товар в корзину и в каком количестве
  const cartItem = cart.find((item) => item.id === id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Проверяем, добавлен ли этот конкретный товар в список избранного
  const isProductFavorite = favorites.some((item) => item.id === id);

  return (
    <div className="shop-product-card-container">
      
      {/* КНОПКА СЕРДЕЧКА поверх фото */}
      <button
        type="button"
        className="shop-card-favorite-btn"
        onClick={(e) => {
          e.preventDefault(); 
          if (toggleFavorite) toggleFavorite(product);
        }}
        title={isProductFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      >
        <span style={{ fontSize: '1.3rem' }}>
          {isProductFavorite ? '❤️' : '🖤'}
        </span>
      </button>

      {/* Динамический бейдж скидки */}
      {label && (
        <span className="shop-card-badge">{label}</span>
      )}

      {/* КЛИКАБЕЛЬНАЯ ЗОНА КАРТИНКИ */}
      <Link to={`/shop/product/${id}`} className="shop-card-image-link">
        <img src={image || 'https://placeholder.com'} alt={title} />
      </Link>

      {/* НАЗВАНИЕ ТОВАРА */}
      <Link to={`/shop/product/${id}`} className="shop-card-title-link">
        {title}
      </Link>

      {/* ==========================================================================
         НИЖНИЙ БЛОК: Цены подняты чуть выше, а кнопка/счетчик стоят под ними
         ========================================================================== */}
      <div className="shop-bottom-wrapper">
        
        {/* 1. Блок стоимостей (ИСПРАВЛЕНО: убрали дублирующиеся приписки "сом") */}
        <div className="shop-price-block">
          <div className="shop-product-current-price">{price}</div>
          {oldPrice && <span className="shop-product-old-price">{oldPrice}</span>}
        </div>

        {/* 2. Зона управления корзиной (Кнопка-кубик ИЛИ Интерактивный счетчик) */}
        <div className="shop-action-zone">
          {quantityInCart > 0 ? (
            /* ЕСЛИ ТОВАР В КОРЗИНЕ: Разворачиваем умный счетчик в стиле WB/Ozon */
            <div className="shop-card-counter-wrapper">
              <button 
                type="button" 
                className="counter-btn minus"
                onClick={() => updateQuantity(id, 'decrease')}
                title="Уменьшить количество"
              >
                −
              </button>
              <span className="counter-value">{quantityInCart}</span>
              <button 
                type="button" 
                className="counter-btn plus"
                onClick={() => updateQuantity(id, 'increase')}
                title="Увеличить количество"
              >
                +
              </button>
            </div>
          ) : (
            /* ЕСЛИ ТОВАРА НЕТ: Показываем стандартный лаконичный синий кубик */
            <button 
              type="button" 
              className="shop-card-buy-btn"
              onClick={() => addToCart(product)}
              title="Добавить в корзину"
            >
              🛒
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
