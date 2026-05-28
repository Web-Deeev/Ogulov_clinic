import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from './ShopContext'; 
import api from '@/api/axios'; // Наш инстанс Axios со слэшем на конце
import { Row, Col, Button, Card } from 'react-bootstrap';

/* Подключаем файл стилей */
import './shopMainDetails.css';

export default function ShopProductPage() {
  // Извлекаем динамический slug_id из URL (в роутере это параметр :id)
  const { id: slug_id } = useParams();
  const navigate = useNavigate();

  // Достаем полный набор необходимых методов и стейтов из контекста
  const { addToCart, cart = [], favorites = [], toggleFavorite, updateQuantity } = useShop();

  // Асинхронные состояния для данных из Django REST Framework
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Локальный стейт для интерактивной галереи
  const [activeImg, setActiveImg] = useState('');

  // Логика модального окна покупки в 1 клик
  const [showFastModal, setShowFastModal] = useState(false);
  const [fastName, setFastName] = useState('');
  const [fastPhone, setFastPhone] = useState('+996 ');

  // АСИНХРОННЫЙ ЗАПРОС К DJANGO REST FRAMEWORK (DefaultRouter /products/<slug_id>/)
  useEffect(() => {
    if (!slug_id) return;
    setLoading(true);
    setError(null);

    api.get(`products/${slug_id}/`)
      .then(response => {
        const djangoData = response.data;
        setProduct(djangoData);
        setActiveImg(djangoData.image); // Изначально крупно показываем главное фото
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки детальной страницы из DRF:", err);
        setError("Товар не найден или временно недоступен.");
        setLoading(false);
      });
  }, [slug_id]);

  // Вычисляем, добавлен ли этот товар в корзину и в каком количестве
  const cartItem = product ? cart.find((item) => String(item.id) === String(product.id)) : null;
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Проверяем, добавлен ли этот конкретный товар в список избранного
  const isProductFavorite = product ? favorites.some((item) => String(item.id) === String(product.id)) : false;

  // Формируем плоский массив всех картинок (Главная + Дополнительные из Django) для карусели превью
  const getAllImages = () => {
    if (!product) return [];
    const images = [product.image];
    if (product.additional_images && Array.isArray(product.additional_images)) {
      product.additional_images.forEach(imgObj => {
        if (imgObj.image) images.push(imgObj.image);
      });
    }
    return images;
  };

  const productImagesList = getAllImages();

  // Логика стрелок карусели нижних превью
  const handlePrevSlide = () => {
    if (productImagesList.length <= 1) return;
    const currentIndex = productImagesList.indexOf(activeImg);
    const nextIndex = currentIndex === 0 ? productImagesList.length - 1 : currentIndex - 1;
    setActiveImg(productImagesList[nextIndex]);
  };

  const handleNextSlide = () => {
    if (productImagesList.length <= 1) return;
    const currentIndex = productImagesList.indexOf(activeImg);
    const nextIndex = currentIndex === productImagesList.length - 1 ? 0 : currentIndex + 1;
    setActiveImg(productImagesList[nextIndex]);
  };

  // Валидация маски телефона Киргизии в модалке 1 клика
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith('+996 ')) return;
    setFastPhone(value);
  };

  // Отправка быстрого заказа в 1 клик под контракт Django Serializer
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

  // 1. Состояние сетевой загрузки
  if (loading) {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка информации...</span>
        </div>
        <p className="text-muted mt-2">Связываемся с сервером клиники Огулова...</p>
      </div>
    );
  }

  // 2. Обработка ошибок (Если товара нет в базе Django)
  if (error || !product) {
    return (
      <div className="container my-5 py-5 text-center bg-white rounded shadow-sm border" style={{ maxWidth: '600px' }}>
        <h3 className="text-danger fw-bold">Товар не найден</h3>
        <p className="text-muted">{error || "Возможно, он был удален или вы ввели неверный адрес."}</p>
        <Link to="/shop" className="btn btn-success mt-3">Вернуться в магазин</Link>
      </div>
    );
  }

  // Считываем красивые форматированные строки цен, присланные Django Serializer
  const displayPrice = product.formatted_price || `${product.price} сом`;
  const displayOldPrice = product.formatted_old_price || (product.old_price ? `${product.old_price} сом` : null);
  return (
    <div className="container my-5 text-dark" style={{ maxWidth: '1140px' }}>
      
      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="shop-breadcrumbs mb-4 small text-muted">
        <Link to="/shop" className="text-decoration-none" style={{ color: '#d9a74a' }}>Главная магазина</Link>
        <span className="mx-2">/</span>
        <span className="text-dark">{product.title}</span>
      </div>

      <Row className="bg-white p-4 rounded shadow-sm g-4 border">
        
        {/* ЛЕВАЯ КОЛОНКА: ГОРИЗОНТАЛЬНАЯ КАРУСЕЛЬ С ПРЕВЬЮ */}
        <Col lg={5} md={12} className="d-flex flex-column gap-3">
          
          {/* Главное большое фото сверху */}
          <div className="text-center bg-white border rounded-3 p-3 d-flex align-items-center justify-content-center shop-main-image-viewport position-relative" style={{ minHeight: '380px', width: '100%' }}>
            <img 
              src={activeImg || product.image} 
              alt={product.title} 
              className="img-fluid shop-zoom-effect" 
              style={{ maxHeight: '350px', objectFit: 'contain', transition: 'transform 0.3s ease' }} 
            />
          </div>

          {/* Лента миниатюр со стрелками по бокам */}
          {productImagesList.length > 1 && (
            <div className="shop-bottom-carousel-wrapper position-relative d-flex align-items-center justify-content-center gap-2 mt-2">
              <button type="button" className="shop-mini-arrow mini-left" onClick={handlePrevSlide}>‹</button>
              
              <div className="shop-horizontal-thumbnails-row d-flex gap-2 overflow-x-auto py-1">
                {productImagesList.map((imgUrl, idx) => (
                  <div 
                    key={idx}
                    className={`shop-thumbnail-item border rounded-2 bg-white ${activeImg === imgUrl ? 'active-border' : ''}`}
                    style={{ width: '60px', height: '60px', padding: '3px', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}
                    onClick={() => setActiveImg(imgUrl)}
                  >
                    <img src={imgUrl} alt={`Ракурс ${idx + 1}`} className="w-100 h-100" style={{ objectFit: 'contain' }} />
                  </div>
                ))}
              </div>

              <button type="button" className="shop-mini-arrow mini-right" onClick={handleNextSlide}>›</button>
            </div>
          )}
        </Col>

        {/* ПРАВАЯ КОЛОНКА: Вся подробная информация о товаре */}
        <Col lg={7} md={12} className="d-flex flex-column">
          
          <div className="mb-2">
            <h1 className="fw-bold text-dark detail-product-title mb-0 h3">{product.title}</h1>
          </div>

          {/* Динамический бейдж ярлыка */}
          {product.label && (
            <span className="shop-card-badge position-static mb-3 align-self-start">
              {product.label}
            </span>
          )}
          
          {/* Секция текущей и зачеркнутой старой стоимости */}
          <div className="d-flex align-items-baseline gap-3 mb-4">
            <div className="detail-price-actual fw-bold text-danger h2 mb-0">
              {displayPrice}
            </div>
            {product.old_price && (
              <div className="detail-price-old text-muted text-decoration-line-through fs-5">
                {displayOldPrice}
              </div>
            )}
          </div>
          
          {/* Описание товара из админки Django */}
          <div className="product-description mb-4">
            <h5 className="fw-bold text-secondary mb-2" style={{ fontSize: '1rem' }}>Описание товара</h5>
            <div className="lh-lg text-secondary" style={{ fontSize: '0.92rem' }}>
              <p>{product.description || "Уникальный сертифицированный товар от Огулов Центра для поддержания естественного здоровья и долголетия."}</p>
            </div>
          </div>

          {/* Характеристики товара (Твой красивый адаптивный сплит-вывод) */}
          {product.specs && (
            <Card className="bg-light border-0 p-3 mb-4">
              <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Характеристики:</h6>
              <ul className="lh-lg mb-0" style={{ paddingLeft: '0', fontSize: '0.88rem' }}>
                {product.specs.split('; ').map((spec, index) => {
                  const parts = spec.split(': ');
                  if (parts.length < 2) return null;
                  const [paramName, paramValue] = parts;
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
          
          {/* УМНАЯ ЗОНА УПРАВЛЕНИЯ КОРЗИНОЙ И СПИСКОМ ЖЕЛАНИЙ */}
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
                  disabled={!product.in_stock}
                >
                  {product.in_stock ? '🛒 В корзину' : 'Нет в наличии'}
                </Button>
              )}
            </div>

            <button type="button" className="detail-inline-favorite-btn" style={{ outline: 'none' }} onClick={() => toggleFavorite(product)}>
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

      {/* ⚡ ВСПЛЫВАЮЩЕЕ ОКНО БЫСТРЫЙ ЗАКАЗ (MODAL) */}
      {showFastModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} onClick={() => setShowFastModal(false)}>
          <div className="bg-white p-4 rounded-4 shadow-lg border" style={{ width: '100%', maxWidth: '360px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="position-absolute border-0 bg-transparent fs-4 text-muted" style={{ top: '10px', right: '15px', cursor: 'pointer', outline: 'none' }} onClick={() => setShowFastModal(false)}>&times;</button>
            <div className="text-center mb-3">
              <h5 className="fw-bold text-dark mb-1">Быстрый заказ</h5>
              <p className="text-muted small">Менеджер клиники перезвонит вам для оформления</p>
            </div>
            <div className="p-2 bg-light rounded text-center small mb-3 text-truncate fw-semibold border text-secondary">📦 {product.title}</div>
            <form onSubmit={handleFastSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-semibold text-secondary mb-1">Ваше имя *</label>
                <input type="text" className="form-control form-control-sm rounded-2" placeholder="Имя" required value={fastName} onChange={(e) => setFastName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary mb-1">Телефон в Киргизии *</label>
                <input type="tel" className="form-control form-control-sm rounded-2 fw-bold" placeholder="+996 555 123 456" required value={fastPhone} onChange={handlePhoneChange} />
              </div>
              <button type="submit" className="btn btn-sm w-100 fw-bold py-2 text-white border-0 rounded-3" style={{ backgroundColor: '#1a1d20' }}>ОТПРАВИТЬ ЗАЯВКУ</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
