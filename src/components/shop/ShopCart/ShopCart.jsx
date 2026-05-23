import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../ShopMainDetails/ShopContext.jsx';

import './cart.css'; 

const ShopCart = () => {
  // Забираем строго твои названия стейтов и функций из контекста
  const { cart = [], updateQuantity, removeFromCart, getCartTotal } = useShop();
  const navigate = useNavigate();

  // Утилита очистки строки цены (чтобы 16 000 сом правильно умножались на количество)
  const parsePrice = (priceVal) => {
    if (!priceVal) return 0;
    if (typeof priceVal === 'number') return priceVal;
    const clean = priceVal.toString().replace(/[^0-9]/g, '');
    return parseInt(clean, 10) || 0;
  };

  // Проверяем твой родной массив cart
  if (cart.length === 0) {
    return (
      <div className="container my-5 text-center py-5">
        <div className="mb-4" style={{ fontSize: '4rem', color: '#6c757d' }}>🛒</div>
        <h2 className="fw-bold mb-3">Ваша корзина пуста</h2>
        <p className="text-muted mb-4">Посмотрите наш каталог, чтобы найти полезные книги, видеокурсы или оборудование.</p>
        <Link to="/shop" className="btn btn-warning px-4 py-2 fw-semibold" style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#000' }}>
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="fw-bold mb-4 position-relative pb-2" style={{ borderBottom: '2px solid #ffc107', display: 'inline-block' }}>
        Корзина
      </h1>
      
      <div className="row g-4">
        {/* Список товаров в корзине */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
            <div className="list-group list-group-flush">
              {cart.map((item) => (
                <div key={item.id} className="list-group-item p-3 p-sm-4">
                  <div className="row align-items-center g-3">
                    
                    {/* Изображение товара */}
                    <div className="col-3 col-sm-2">
                      <img 
                        src={item.image || 'https://placeholder.com'} 
                        alt={item.title} 
                        className="img-fluid rounded border"
                        style={{ maxHeight: '80px', objectFit: 'contain' }}
                      />
                    </div>
                    
                    {/* Название */}
                    <div className="col-9 col-sm-4">
                      <h6 className="fw-bold mb-1">
                        <Link to={`/shop/product/${item.id}`} className="text-decoration-none text-dark fw-bold">
                          {item.title}
                        </Link>
                      </h6>
                    </div>
                    
                    {/* Кнопки количества под твою функцию updateQuantity */}
                    <div className="col-6 col-sm-3 d-flex align-items-center justify-content-sm-center">
                      <div className="input-group input-group-sm" style={{ maxWidth: '110px' }}>
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={() => updateQuantity(item.id, 'decrease')}
                        >
                          -
                        </button>
                        <input 
                          type="text" 
                          className="form-control text-center bg-white border-secondary-subtle" 
                          value={item.quantity} 
                          readOnly
                          style={{ width: '40px' }}
                        />
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={() => updateQuantity(item.id, 'increase')}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Стоимость и кнопка полного удаления */}
                    <div className="col-6 col-sm-3 text-end d-flex align-items-center justify-content-end gap-3">
                      <span className="fw-bold fs-5 text-nowrap">
                        {/* ИСПРАВЛЕНО: Теперь математика перемножения строк считает сомы безупречно */}
                        {(parsePrice(item.price) * item.quantity).toLocaleString()} сом
                      </span>
                      <button 
                        className="btn btn-link text-danger p-0 border-0 text-decoration-none"
                        onClick={() => removeFromCart(item.id)}
                        title="Удалить товар"
                        style={{ fontSize: '1.2rem' }}
                      >
                        🗑️
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Сайдбар с итоговой стоимостью */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-3 p-4 bg-light">
            <h5 className="fw-bold mb-4">Детали заказа</h5>
            
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Товары:</span>
              <span className="fw-semibold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} шт.
              </span>
            </div>
            
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Доставка:</span>
              <span className="text-success small fw-semibold">Рассчитывается далее</span>
            </div>
            
            <hr className="my-3" />
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold fs-5">Итого к оплате:</span>
              <span className="fw-bold fs-4 text-dark">{getCartTotal().toLocaleString()} сом</span>
            </div>
            
            {/* ЧИСТЫЙ ВАРИАНТ 1: Прямой бесшовный переход на страницу оформления */}
            <button 
              onClick={() => navigate('/shop/checkout')}
              className="btn btn-warning w-100 py-3 fw-bold text-dark rounded-3 shadow-sm"
              style={{ backgroundColor: '#ffc107', borderColor: '#ffc107' }}
            >
              Перейти к оформлению
            </button>
            
            <div className="mt-3 text-center">
              <Link to="/shop" className="text-decoration-none text-muted small">
                ← Вернуться к покупкам
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCart;
