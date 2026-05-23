import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from './ShopContext'; 
import { productsData } from './shopData.js'; 
import { Row, Col, Button, Card, Modal } from 'react-bootstrap';

/* Подключаем файл стилей */
import './shopMainDetails.css';

export default function ShopProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();


  // Достаем полный набор необходимых методов и стейтов из контекста
  const { addToCart, cart = [], favorites = [], toggleFavorite, updateQuantity } = useShop();

  // Универсальный и безопасный поиск товара через .toString()
  const product = productsData.find(item => item.id?.toString() === id?.toString());
  
  // Локальный стейт для интерактивной галереи
  const [activeImg, setActiveImg] = useState('');

  // Логика модального окна покупки в 1 клик
  const [showFastModal, setShowFastModal] = useState(false);
  const [fastName, setFastName] = useState('');
  const [fastPhone, setFastPhone] = useState('+996 ');

  // При загрузке страницы выставляем главное фото товара активным
  useEffect(() => {
    if (product) {
      setActiveImg(product.image);
    }
  }, [product]);

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

  // Логика стрелок карусели нижних превью
  const handlePrevSlide = () => {
    if (!product.images || product.images.length <= 1) return;
    const currentIndex = product.images.indexOf(activeImg);
    const nextIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    setActiveImg(product.images[nextIndex]);
  };

  const handleNextSlide = () => {
    if (!product.images || product.images.length <= 1) return;
    const currentIndex = product.images.indexOf(activeImg);
    const nextIndex = currentIndex === product.images.length - 1 ? 0 : currentIndex + 1;
    setActiveImg(product.images[nextIndex]);
  };

  // Валидация маски телефона Киргизии в модалке 1 клика
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith('+996 ')) return;
    setFastPhone(value);
  };


  // Отправка быстрого заказа в 1 клик
  const handleFastSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = fastPhone.replace(/\s+/g, '');
    if (cleanPhone.length < 13) {
      alert("Пожалуйста, введите корректный номер телефона Кыргызстана!");
      return;
    }

    const fastOrderPayload = {
      customer_name: fastName,
      phone: cleanPhone,
      product_id: product.id,
      quantity: 1,
      price_at_order: product.price,
      currency: "KGS"
    };

    console.log("=== API PAYLOAD ДЛЯ DJANGO (БЫСТРЫЙ ЗАКАЗ) ===");
    console.log(JSON.stringify(fastOrderPayload, null, 2));

    alert(`Спасибо, ${fastName}! Заявка принята. Менеджер клиники свяжется с вами по номеру ${fastPhone}.`);
    setFastName('');
    setFastPhone('+996 ');
    setShowFastModal(false);
  };

  return (
    <div className="container my-5 text-dark" style={{ maxWidth: '1140px' }}>
      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="shop-breadcrumbs mb-4 small text-muted">
        <Link to="/shop" className="text-decoration-none" style={{ color: '#d9a74a' }}>Главная магазина</Link>
        <span className="mx-2">/</span>
        <span className="text-dark">{product.title}</span>
      </div>

      <Row className="bg-white p-4 rounded shadow-sm g-4 border">
        
        {/* ЛЕВАЯ КОЛОНКА: ГОРИЗОНТАЛЬНАЯ КАРУСЕЛЬ С НИЖНИМИ СТРЕЛКАМИ */}
        <Col lg={5} md={12} className="d-flex flex-column gap-3">
          
          {/* 1. Главное большое фото сверху (теперь без стрелок) */}
          <div className="text-center bg-white border rounded-3 p-3 d-flex align-items-center justify-content-center shop-main-image-viewport" style={{ minHeight: '380px', width: '100%' }}>
            <img 
              src={activeImg || product.image} 
              alt={product.title} 
              className="img-fluid shop-zoom-effect" 
              style={{ maxHeight: '350px', objectFit: 'contain', transition: 'transform 0.3s ease' }} 
            />
          </div>

          {/* 2. ИСПРАВЛЕНО: Карусель превью со стрелками по бокам */}
          {product.images && product.images.length > 1 && (
            <div className="shop-bottom-carousel-wrapper">
              
              {/* Левая стрелка прямо на блоке фоток */}
              <button type="button" className="shop-mini-arrow mini-left" onClick={handlePrevSlide}>‹</button>
              
              {/* Лента миниатюр */}
              <div className="shop-horizontal-thumbnails-row">
                {product.images.map((imgUrl, idx) => (
                  <div 
                  key={idx}
                  className={`shop-thumbnail-item border rounded-2 bg-white ${activeImg === imgUrl ? 'active-border' : ''}`}
                  style={{ width: '60px', height: '60px', padding: '3px', overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => setActiveImg(imgUrl)} // <-- Оставляем только клик!
                  >
                  <img src={imgUrl} alt={`Ракурс ${idx + 1}`} className="w-100 h-100" style={{ objectFit: 'contain' }} />
                  </div>
                ))}
              </div>

              {/* Правая стрелка прямо на блоке фоток */}
              <button type="button" className="shop-mini-arrow mini-right" onClick={handleNextSlide}>›</button>
              
            </div>
          )}
        </Col>

        {/* ПРАВАЯ КОЛОНКА: Вся информация */}
        <Col lg={7} md={12} className="d-flex flex-column">
          
          <div className="mb-2">
            <h1 className="fw-bold text-dark detail-product-title mb-0 h3">{product.title}</h1>
          </div>

          {/* Динамический бейдж */}
          {product.label && (
            <span className="shop-card-badge position-static mb-3 align-self-start">
              {product.label}
            </span>
          )}
          
          {/* Секция цен */}
          <div className="d-flex align-items-baseline gap-3 mb-4">
            <div className="detail-price-actual fw-bold text-danger h2 mb-0">
              {typeof product.price === 'number' ? `${product.price.toLocaleString('ru-RU')} сом` : product.price}
            </div>
            {product.oldPrice && (
              <div className="detail-price-old text-muted text-decoration-line-through fs-5">
                {typeof product.oldPrice === 'number' ? `${product.oldPrice.toLocaleString('ru-RU')} сом` : product.oldPrice}
              </div>
            )}
          </div>
          
          {/* Описание товара */}
          <div className="product-description mb-4">
            <h5 className="fw-bold text-secondary mb-2" style={{ fontSize: '1rem' }}>Описание товара</h5>
            <div className="lh-lg text-secondary" style={{ fontSize: '0.92rem' }}>
              <p>{product.description || "Уникальный сертифицированный товар от Огулов Центра для поддержания естественного здоровья и долголетия."}</p>
            </div>
          </div>

          {/* Характеристики товара */}
          {product.specs && (
            <Card className="bg-light border-0 p-3 mb-4">
              <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Характеристики:</h6>
              <ul className="lh-lg mb-0" style={{ paddingLeft: '0', fontSize: '0.88rem' }}>
                {product.specs.split('; ').map((spec, index) => {
                  const [paramName, paramValue] = spec.split(': ');
                  return (
                    <li key={index} className="d-flex justify-content-between border-bottom pb-2 mb-2 border-secondary-subtle">
                      <strong className="text-muted">{paramName}:</strong>
                      <span className="text-dark fw-bold">{paramValue || ''}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
          
          {/* УМНАЯ ЗОНА УПРАВЛЕНИЯ */}
          <div className="mt-auto d-flex align-items-center gap-3 w-100 mb-2" style={{ maxWidth: '420px' }}>
            <div className="flex-grow-1">
              {quantityInCart > 0 ? (
                <div className="detail-page-counter-box">
                  <span className="counter-cart-icon">🛒</span>
                  <div className="counter-controls-wrap">
                    <button type="button" className="ctrl-btn-minus" onClick={() => updateQuantity(product.id, 'decrease')}>−</button>
                    <span className="ctrl-value-num">{quantityInCart}</span>
                    <button type="button" className="ctrl-btn-plus" onClick={() => updateQuantity(product.id, 'increase')}>+</button>
                  </div>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  className="btn-detail-buy text-uppercase w-100 text-white fw-bold"
                  style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd', height: '48px', fontSize: '0.9rem' }}
                  onClick={() => addToCart(product)}
                >
                  🛒 В корзину
                </Button>
              )}
            </div>

            <button type="button" className="detail-inline-favorite-btn" onClick={() => toggleFavorite(product)}>
              <span>{isProductFavorite ? '❤️' : '🤍'}</span>
            </button>
          </div>

          {/* Ссылка на покупку в 1 клик */}
          <div style={{ maxWidth: '420px' }} className="text-center mb-3">
            <button 
              type="button"
              className="btn btn-link p-0 text-decoration-none small fw-bold"
              style={{ color: '#d9a74a', fontSize: '0.85rem' }}
              onClick={() => setShowFastModal(true)}
            >
              ⚡ Купить в 1 клик
            </button>
          </div>

          <div className="p-3 bg-light border rounded-3 small text-muted" style={{ maxWidth: '420px' }}>
            🛡️ Официальный товар Огулов Центра. Оперативная доставка по Бишкеку или СДЭК по Киргизии.
          </div>

        </Col>
      </Row>

      {/* ⚡ МОДАЛЬНОЕ ОКНО БЫСТРОГО ЗАКАЗА */}
      {showFastModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} onClick={() => setShowFastModal(false)}>
          <div className="bg-white p-4 rounded shadow-lg border" style={{ width: '100%', maxWidth: '360px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="position-absolute border-0 bg-transparent fs-4 text-muted" style={{ top: '10px', right: '15px', cursor: 'pointer' }} onClick={() => setShowFastModal(false)}>&times;</button>
            <div className="text-center mb-3">
              <h5 className="fw-bold text-dark mb-1">Быстрый заказ</h5>
              <p className="text-muted small">Менеджер клиники перезвонит вам для оформления</p>
            </div>
            <div className="p-2 bg-light rounded text-center small mb-3 text-truncate fw-semibold border text-secondary">📦 {product.title}</div>
            <form onSubmit={handleFastSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-semibold text-secondary mb-1">Ваше имя *</label>
                <input type="text" className="form-control form-control-sm" placeholder="Имя" required value={fastName} onChange={(e) => setFastName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary mb-1">Телефон в Киргизии *</label>
                <input type="tel" className="form-control form-control-sm" placeholder="+996 555 123 456" required value={fastPhone} onChange={handlePhoneChange} />
              </div>
              <button type="submit" className="btn btn-sm w-100 fw-bold py-2 text-white border-0" style={{ backgroundColor: '#1a1d20' }}>ОТПРАВИТЬ ЗАЯВКУ</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
