import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from './ShopContext'; 
import { productsData } from './shopData.js'; 
import { Row, Col, Button, Card } from 'react-bootstrap';

/* ИСПРАВЛЕНО: Подключаем наш правильный файл стилей маленькими буквами */
import './shopMainDetails.css';

export default function ShopProductPage() {
  // Вытаскиваем id товара из адресной строки браузера (всегда строка)
  const { id } = useParams();
  
  // Достаем полный набор необходимых методов и стейтов из контекста
  const { addToCart, cart = [], favorites = [], toggleFavorite, updateQuantity } = useShop();

  // Универсальный и безопасный поиск товара через .toString()
  const product = productsData.find(item => item.id?.toString() === id?.toString());
  
  // Проверяем, добавлен ли этот товар в корзину и в каком количестве
  const cartItem = cart.find((item) => item.id?.toString() === id?.toString());
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Проверяем, добавлен ли этот конкретный товар в список избранного
  const isProductFavorite = favorites.some((item) => item.id?.toString() === id?.toString());

  // Заглушка, если товар не найден
  if (!product) {
    return (
      <div className="container my-5 py-5 text-center bg-white rounded shadow-sm border">
        <h3 className="text-danger fw-bold">Товар не найден</h3>
        <p className="text-muted">Возможно, он был удален или вы ввели неверный адрес.</p>
        <Link to="/shop" className="btn btn-success mt-3">Вернуться в магазин</Link>
      </div>
    );
  }

  return (
    <div className="container my-5 text-dark">
      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="shop-breadcrumbs mb-4 small text-muted">
        <Link to="/shop" className="text-decoration-none" style={{ color: '#d9a74a' }}>Главная магазина</Link>
        <span className="mx-2">/</span>
        <span className="text-dark">{product.title}</span>
      </div>

      <Row className="bg-white p-4 rounded shadow-sm g-4 border">
        {/* Левая колонка: Крупное изображение товара */}
        <Col md={5} className="text-center">
          <div className="detail-image-block">
            <img 
              src={product.image} 
              alt={product.title} 
              className="img-fluid rounded" 
            />
          </div>
        </Col>

        {/* Правая колонка: Основная информация */}
        <Col md={7} className="d-flex flex-column">
          
          {/* ИСПРАВЛЕНО: Убрали сердечко отсюда, заголовок теперь чистый */}
          <div className="mb-2">
            <h1 className="fw-bold text-dark detail-product-title mb-0">{product.title}</h1>
          </div>

          {/* Динамический бейдж: "Хит" или "Новинка" */}
          {product.label && (
            <span className="shop-card-badge position-static mb-3 align-self-start">
              {product.label}
            </span>
          )}
          
            
          <div className="d-flex align-items-baseline gap-3 mb-4">
            <div className="detail-price-actual">{product.price}</div>
            {product.oldPrice && (
              <div className="detail-price-old">
                {product.oldPrice}
              </div>
            )}
          </div>
          
          {/* Описание товара */}
          <div className="product-description mb-4 tab-content">
            <h5 className="fw-bold text-secondary mb-2">Описание товара</h5>
            <div className="lh-lg">
              <p>{product.description || "Уникальный сертифицированный товар от Огулов Центра для поддержания естественного здоровья и долголетия."}</p>
            </div>
          </div>

          {/* Характеристики (Парсинг строки через разделитель) */}
          {product.specs && (
            <Card className="bg-light border-0 p-3 mb-4 tab-content">
              <h6 className="fw-bold text-dark mb-2">Характеристики:</h6>
              <ul className="lh-lg mb-0" style={{ paddingLeft: '0' }}>
                {product.specs.split('; ').map((spec, index) => {
                  const [paramName, paramValue] = spec.split(': ');
                  return (
                    <li key={index} className="d-flex justify-content-between border-bottom pb-2 mb-2 border-secondary-subtle">
                      <strong>{paramName}:</strong>
                      <span>{paramValue || ''}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

           {/* ==========================================================================
             УМНАЯ ЗОНА УПРАВЛЕНИЯ (Корзина и Сердечко теперь строго в один ряд)
             ========================================================================== */}
          <div className="mt-auto d-flex align-items-center gap-3 w-100" style={{ maxWidth: '420px' }}>
            
            {/* Левый блок: Корзина/Счетчик */}
            <div className="flex-grow-1">
              {quantityInCart > 0 ? (
                /* ЕСЛИ ТОВАР В КОРЗИНЕ: Новая плашка. Слева ярлык корзины, справа кнопки управления */
                <div className="detail-page-counter-box">
                  <span className="counter-cart-icon">🛒</span>
                  <div className="counter-controls-wrap">
                    <button 
                      type="button" 
                      className="ctrl-btn-minus" 
                      onClick={() => updateQuantity(product.id, 'decrease')}
                      title="Уменьшить количество"
                    >
                      −
                    </button>
                    <span className="ctrl-value-num">{quantityInCart}</span>
                    <button 
                      type="button" 
                      className="ctrl-btn-plus" 
                      onClick={() => updateQuantity(product.id, 'increase')}
                      title="Увеличить количество"
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                /* ЕСЛИ ТОВАРА НЕТ В КОРЗИНЕ: Стандартная большая СИНЯЯ кнопка */
                <Button 
                  size="lg" 
                  className="btn-detail-buy text-uppercase w-100"
                  onClick={() => addToCart(product)}
                >
                  🛒 В корзину
                </Button>
              )}
            </div>

            {/* Правый блок: КНОПКА ИЗБРАННОГО */}
            <button
              type="button"
              className="detail-inline-favorite-btn"
              onClick={() => {
                if (toggleFavorite) toggleFavorite(product);
              }}
              title={isProductFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            >
              <span>{isProductFavorite ? '❤️' : '🤍'}</span>
            </button>

          </div>

        </Col>
      </Row>
    </div>
  );
}
