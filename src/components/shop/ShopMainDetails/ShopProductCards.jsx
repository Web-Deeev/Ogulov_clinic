import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from './ShopContext'; 

/* Подключаем правильный модульный файл стилей маленькими буквами */
import './shopMainDetails.css';

export default function ProductCard({ product }) {
  const { id, title, price, oldPrice, image, label } = product;
  
  // Достаем методы корзины и избранного из твоего глобального контекста
  const { addToCart, cart = [], favorites = [], toggleFavorite, updateQuantity } = useShop();

  // Состояния для модального окна покупки в 1 клик
  const [showFastModal, setShowFastModal] = useState(false);
  const [fastName, setFastName] = useState('');
  const [fastPhone, setFastPhone] = useState('+996 ');

  // Находим, добавлен ли этот товар в корзину и в каком количестве
  const cartItem = cart.find((item) => item.id === id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Проверяем, добавлен ли этот конкретный товар в список избранного
  const isProductFavorite = favorites.some((item) => item.id === id);

  // Обработчик ввода телефона с защитой префикса Киргизии
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith('+996 ')) return;
    setFastPhone(value);
  };

  // Сабмит формы быстрой покупки в 1 клик под Django DRF
  const handleFastSubmit = (e) => {
    e.preventDefault();

    const cleanPhone = fastPhone.replace(/\s+/g, '');
    if (cleanPhone.length < 13) {
      alert("Пожалуйста, введите корректный номер телефона Кыргызстана!");
      return;
    }

    // Идеальный плоский JSON пакет для быстрого заказа в Django
    const fastOrderPayload = {
      customer_name: fastName,
      phone: cleanPhone,
      product_id: id,
      quantity: 1,
      price_at_order: price,
      currency: "KGS"
    };

    console.log("=== API PAYLOAD: БЫСТРЫЙ ЗАКАЗ В 1 КЛИК ДЛЯ DJANGO ===");
    console.log(JSON.stringify(fastOrderPayload, null, 2));

    alert(`Спасибо за заявку, ${fastName}!\nМенеджер свяжется с вами по номеру ${fastPhone} для подтверждения заказа товара:\n"${title}"`);
    
    setFastName('');
    setFastPhone('+996 ');
    setShowFastModal(false);
  };

  return (
    <div className="shop-product-card-container" style={{ position: 'relative' }}>
      
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
          {isProductFavorite ? '❤️' : '🤍'}
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
         НИЖНИЙ БЛОК: Цены, кнопки корзины и Быстрого заказа
         ========================================================================== */}
      <div className="shop-bottom-wrapper d-flex flex-column gap-2 mt-auto">
        
        {/* Блок стоимостей и кнопка Купить на одной линии */}
        <div className="shop-price-block d-flex align-items-center justify-content-between w-100">
          <div className="d-flex flex-column">
            <div className="shop-product-current-price fw-bold text-success">{price}</div>
            {oldPrice && <span className="shop-product-old-price text-decoration-line-through text-muted small">{oldPrice}</span>}
          </div>

          {/* Зона управления корзиной (Синяя кнопка "Купить" или счётчик) */}
          <div className="shop-action-zone">
            {quantityInCart > 0 ? (
              <div className="shop-card-counter-wrapper d-flex align-items-center border rounded bg-white">
                <button 
                  type="button" 
                  className="btn btn-sm px-2 py-1 fw-bold text-secondary"
                  onClick={() => updateQuantity(id, 'decrease')}
                >
                  −
                </button>
                <span className="px-2 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{quantityInCart}</span>
                <button 
                  type="button" 
                  className="btn btn-sm px-2 py-1 fw-bold text-secondary"
                  onClick={() => updateQuantity(id, 'increase')}
                >
                  +
                </button>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn shop-card-buy-btn-blue d-flex align-items-center gap-2 px-3 py-1.5 rounded-3 text-white fw-semibold"
                onClick={() => addToCart(product)}
                title="Добавить в корзину"
              >
                <span>🛒</span>
                <span style={{ fontSize: '0.88rem' }}>Купить</span>
              </button>
            )}
          </div>
        </div>

        {/* Ссылка на покупку в 1 клик */}
        <div className="w-100 text-center mt-1 border-top pt-2">
          <button 
            type="button"
            className="btn btn-link p-0 text-decoration-none small fw-bold"
            style={{ color: '#d9a74a', fontSize: '0.82rem' }}
            onClick={() => setShowFastModal(true)}
          >
            ⚡ Купить в 1 клик
          </button>
        </div>

      </div>

      {/* ⚡ ВСПЛЫВАЮЩЕЕ ОКНО: БЫСТРЫЙ ЗАКАЗ (MODAL) */}
      {showFastModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          onClick={() => setShowFastModal(false)}
        >
          <div 
            className="bg-white p-4 rounded shadow-lg border" 
            style={{ width: '100%', maxWidth: '360px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              className="position-absolute border-0 bg-transparent fs-4 text-muted" 
              style={{ top: '10px', right: '15px', cursor: 'pointer' }}
              onClick={() => setShowFastModal(false)}
            >
              &times;
            </button>

            <div className="text-center mb-3">
              <h5 className="fw-bold text-dark mb-1">Быстрый заказ</h5>
              <p className="text-muted small">Оставьте контактные данные, менеджер клиники перезвонит вам для оформления</p>
            </div>

            <div className="p-2 bg-light rounded text-center small mb-3 text-truncate fw-semibold border text-secondary">
              📦 {title}
            </div>

            <form onSubmit={handleFastSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-semibold text-secondary mb-1">Ваше имя *</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Имя" 
                  required
                  value={fastName}
                  onChange={(e) => setFastName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary mb-1">Телефон в Киргизии *</label>
                <input 
                  type="tel" 
                  className="form-control form-control-sm" 
                  placeholder="+996 555 123 456" 
                  required
                  value={fastPhone}
                  onChange={handlePhoneChange}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-sm w-100 fw-bold py-2 text-white border-0"
                style={{ backgroundColor: '#1a1d20' }}
              >
                ОТПРАВИТЬ ЗАЯВКУ
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
