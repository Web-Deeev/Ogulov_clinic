import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from './ShopContext'; // Импортируем наш глобальный контекст

export default function ProductCard({ product }) {
  // Расширяем деструктуризацию под новые поля из productsData
  const { id, title, price, oldPrice, image, label } = product;
  
  // Достаем addToCart и сам массив корзины для проверки дубликатов
  const { addToCart, cart = [] } = useShop();

  // Находим, добавлен ли этот товар в корзину и в каком количестве
  const cartItem = cart.find((item) => item.id === id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="product-card">
      {/* Динамический бейдж: выведет любую метку ("Хит", "Скидка 15%", "Рекомендовано") */}
      {label && (
        <span className="product-label-hit">{label}</span>
      )}

      {/* Клик по картинке плавно уводит пользователя на детальную страницу товара */}
      <Link to={`/shop/product/${id}`} className="product-card-image-link">
        <div className="product-card-image-wrap">
          <img src={image} alt={title} className="product-card-img" />
        </div>
      </Link>

      <div className="product-card-info">
        {/* Клик по названию товара */}
        <h4 className="product-card-title">
          <Link to={`/shop/product/${id}`} className="product-card-title-link">
            {title}
          </Link>
        </h4>

        {/* Блок стоимости с поддержкой старой цены */}
        <div className="product-card-price-block d-flex align-items-baseline gap-2">
          <div className="product-card-price">{price}</div>
          
          {/* Если есть старая цена, рендерим её рядом */}
          {oldPrice && (
            <span className="text-muted text-decoration-line-through small fw-normal ms-2" style={{ fontSize: '0.85em' }}>
              {oldPrice}
            </span>
          )}
        </div>

        {/* Умная кнопка покупки */}
        <button 
          type="button" 
          className={`product-card-btn-buy ${quantityInCart > 0 ? 'btn-in-cart' : ''}`}
          onClick={() => addToCart(product)}
        >
          {/* Если товар уже в корзине, пишем количество, иначе стандартное "Купить" */}
          {quantityInCart > 0 ? `В корзине (${quantityInCart})` : 'Купить'}
        </button>
      </div>
    </div>
  );
}
