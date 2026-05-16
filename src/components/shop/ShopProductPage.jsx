import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from './ShopContext'; // Наш глобальный контекст
import { productsData } from './shopData.js'; // ИСПРАВЛЕНО: Единый массив товаров
import { Row, Col, Button, Card } from 'react-bootstrap';

export default function ShopProductPage() {
  // 1. Вытаскиваем id товара из адресной строки браузера (например, "101")
  const { id } = useParams();
  
  // Достаем корзину и функцию добавления напрямую из контекста
  const { addToCart, cart = [] } = useShop();

  // 2. Ищем конкретный товар в нашей единой базе по его id
  const product = productsData.find(item => item.id === id);
  
  // Проверяем, добавлен ли этот товар в корзину и в каком количестве
  const cartItem = cart.find((item) => item.id === id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Если вдруг товар по такому id не найден в базе
  if (!product) {
    return (
      <div className="container my-5 py-5 text-center bg-white rounded shadow-sm">
        <h3 className="text-danger">Товар не найден</h3>
        <p className="text-muted">Возможно, он был удален или вы ввели неверный адрес.</p>
        <Link to="/shop" className="btn btn-success mt-3">Вернуться в магазин</Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="shop-breadcrumbs mb-4 small text-muted">
        <Link to="/shop" className="text-decoration-none text-success">Главная магазина</Link>
        <span className="mx-2">/</span>
        <span className="text-dark">{product.title}</span>
      </div>

      <Row className="bg-white p-4 rounded shadow-sm g-4">
        {/* Левая колонка: Крупное изображение товара */}
        <Col md={5} className="text-center">
          <img 
            src={product.image} 
            alt={product.title} 
            className="img-fluid rounded" 
            style={{ maxHeight: '400px', objectFit: 'contain', width: '100%' }}
          />
        </Col>

        {/* Правая колонка: Основная информация */}
        <Col md={7} className="d-flex flex-column">
          {/* Динамический бейдж: выведет "Хит", "Скидка 15%" или "Рекомендовано" */}
          {product.label && (
            <span className="badge bg-danger text-uppercase mb-2 align-self-start py-2 px-3">
              {product.label}
            </span>
          )}
          
          <h1 className="fw-bold text-dark mb-3">{product.title}</h1>
          
          {/* Блок стоимости с поддержкой зачеркнутой старой цены */}
          <div className="d-flex align-items-baseline gap-3 mb-4">
            <div className="fs-3 fw-bold text-success">{product.price}</div>
            {product.oldPrice && (
              <div className="fs-5 text-muted text-decoration-line-through fw-normal">
                {product.oldPrice}
              </div>
            )}
          </div>
          
          <div className="product-description mb-4">
            <h5 className="fw-bold text-secondary">Описание товара</h5>
            <p className="text-muted lh-lg">{product.description}</p>
          </div>

          {/* Парсим и красиво выводим характеристики (specs) из строки */}
          {product.specs && (
            <Card className="bg-light border-0 p-3 mb-4">
              <h6 className="fw-bold text-dark mb-2">Характеристики:</h6>
              <ul className="list-unstyled mb-0 small text-secondary">
                {product.specs.split('; ').map((spec, index) => (
                  <li key={index} className="mb-1">
                    • {spec}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Умная кнопка добавления в корзину */}
          <div className="mt-auto">
            <Button 
              size="lg" 
              className={`w-100 fw-bold py-3 border-0 ${quantityInCart > 0 ? 'btn-warning text-dark' : 'btn-success'}`}
              onClick={() => addToCart(product)}
            >
              {quantityInCart > 0 ? (
                <>🛒 В корзине ({quantityInCart} шт.) — Добавить еще</>
              ) : (
                <>🛒 Добавить в корзину</>
              )}
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
