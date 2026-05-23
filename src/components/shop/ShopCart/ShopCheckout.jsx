import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../ShopMainDetails/ShopContext'; 
import './cart.css';

export default function ShopCheckout() {
  const { cart = [], getCartTotal, clearCart } = useShop();
  const navigate = useNavigate();

  // Глобальный тип получения: 'DELIVERY' (Доставка) или 'PICKUP' (Самовывоз)
  const [deliveryType, setDeliveryType] = useState('DELIVERY');

  // Состояние формы покупателя
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '+996 ', 
    delivery_method: 'BISHKEK', // Под-метод доставки: BISHKEK или CDEK
    delivery_address: '',
    comment: ''
  });

  // Утилита очистки строки цены для сомов
  const parsePrice = (priceVal) => {
    if (!priceVal) return 0;
    if (typeof priceVal === 'number') return priceVal;
    const clean = priceVal.toString().replace(/[^0-9]/g, '');
    return parseInt(clean, 10) || 0;
  };

  // Сборщик вложенного массива товаров под Django DRF
  const orderItems = cart.map(item => ({
    product_id: item.id,      
    quantity: item.quantity,  
    price_at_purchase: parsePrice(item.price) 
  }));

  // Расчет стоимости доставки (Если Самовывоз — строго 0 сом, иначе зависит от курьера/СДЭК)
  const deliveryCost = deliveryType === 'PICKUP' 
    ? 0 
    : (formData.delivery_method === 'BISHKEK' ? 200 : 400);

  const finalTotalSum = getCartTotal() + deliveryCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Блокируем удаление киргизского телефонного префикса
    if (name === 'phone' && !value.startsWith('+996 ')) {
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Переключатель между вкладками ДОСТАВКА / САМОВЫВОЗ
  const handleTypeTabChange = (type) => {
    setDeliveryType(type);
    setFormData(prev => ({
      ...prev,
      // Если выбрали самовывоз — жестко фиксируем адрес клиники
      delivery_address: type === 'PICKUP' ? 'г. Бишкек, Филиал клиники профессора Огулова А.Т.' : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Ваша корзина пуста!");
      return;
    }

    const cleanPhone = formData.phone.replace(/\s+/g, '');
    if (cleanPhone.length < 13) {
      alert("Пожалуйста, введите корректный номер телефона Кыргызстана!");
      return;
    }

    // Итоговый JSON-пакет для POST-запроса в Django Nested Serializer
    const djangoOrderPayload = {
      customer_name: formData.customer_name,
      phone: cleanPhone, 
      // На бэк летит либо PICKUP, либо конкретный метод доставки (BISHKEK/CDEK)
      delivery_method: deliveryType === 'PICKUP' ? 'PICKUP' : formData.delivery_method,
      delivery_address: formData.delivery_address,
      comment: formData.comment,
      delivery_amount: deliveryCost,
      total_amount: finalTotalSum,
      currency: "KGS",
      items: orderItems 
    };

     console.log("=== ГОТОВЫЙ JSON ПАКЕТ ДЛЯ POST-ЗАПРОСА В DJANGO DRF ===");
    console.log(JSON.stringify(djangoOrderPayload, null, 2));
    
    // 1. Генерируем временный ID заказа (пока нет бэкенда Django)
    const mockDjangoOrderId = Math.floor(1000 + Math.random() * 9000);
    
    // 2. Очищаем корзину через метод из глобального контекста
    if (clearCart) clearCart(); 
    
    // 3. ПЕРЕХОДИМ на страницу успеха и пробрасываем туда данные заказа
    navigate('/shop/order-success', { 
      state: { 
        orderId: mockDjangoOrderId,
        totalSum: finalTotalSum
      } 
    }); 
  };


  if (!cart || cart.length === 0) {
    return (
      <div className="container text-center py-5 my-5">
        <div className="fs-1 mb-3">📦</div>
        <h2 className="mb-3 fw-bold">Нет товаров для оформления</h2>
        <p className="text-muted mb-4">Для оформления заказа добавьте товары из каталога в корзину.</p>
        <Link to="/shop" className="btn fw-bold px-4 py-2" style={{ backgroundColor: '#d9a74a', color: '#fff' }}>
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4 text-dark" style={{ maxWidth: '1140px' }}>
      {/* Хлебные крошки */}
      <nav className="small mb-4 text-muted">
        <Link to="/shop" className="text-decoration-none text-secondary">Главная</Link>
        <span className="mx-2">/</span>
        <Link to="/shop/cart" className="text-decoration-none text-secondary">Корзина</Link>
        <span className="mx-2">/</span>
        <span className="text-dark fw-semibold">Оформление заказа</span>
      </nav>

      <form onSubmit={handleSubmit} className="row g-4 align-items-start">


        
        {/* ЛЕВАЯ ЧАСТЬ: Блоки ввода данных */}
        <div className="col-lg-7">
          
          {/* Блок 1: Данные получателя */}
          <div className="p-4 bg-white rounded shadow-sm border mb-4">
            <h4 className="mb-4 fw-bold text-uppercase border-bottom pb-2 text-dark fs-5">
              <span className="text-warning me-2">1.</span> Данные получателя
            </h4>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small fw-semibold text-muted mb-1">ФИО полностью *</label>
                <input 
                  type="text" 
                  name="customer_name" 
                  className="form-control p-2" 
                  placeholder="Например: Асанбеков Алмаз"
                  required 
                  value={formData.customer_name} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-muted mb-1">Телефон для связи *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  className="form-control p-2" 
                  placeholder="+996 555 123 456" 
                  required 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>

          {/* Блок 2: Способ получения (ДВЕ ВКЛАДКИ) */}
          <div className="p-4 bg-white rounded shadow-sm border">
            <h4 className="mb-4 fw-bold text-uppercase border-bottom pb-2 text-dark fs-5">
              <span className="text-warning me-2">2.</span> Способ получения
            </h4>
            
            {/* Переключатели в виде двух красивых окон (вкладок) */}
            <div className="row g-2 mb-4">
              <div className="col-6">
                <button
                  type="button"
                  className={`btn w-100 py-3 fw-bold border text-uppercase fs-7 ${deliveryType === 'DELIVERY' ? 'btn-dark text-white border-dark shadow-sm' : 'btn-light text-muted bg-white'}`}
                  style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}
                  onClick={() => handleTypeTabChange('DELIVERY')}
                >
                  🚚 Доставка
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className={`btn w-100 py-3 fw-bold border text-uppercase fs-7 ${deliveryType === 'PICKUP' ? 'btn-dark text-white border-dark shadow-sm' : 'btn-light text-muted bg-white'}`}
                  style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}
                  onClick={() => handleTypeTabChange('PICKUP')}
                >
                  🏢 Самовывоз
                </button>
              </div>
            </div>

            <div className="row g-3">
              {/* Показываем под-методы доставки ТОЛЬКО если выбрана вкладка Доставка */}
              {deliveryType === 'DELIVERY' && (
                <div className="col-12 animate-fade-in">
                  <label className="form-label small fw-semibold text-muted mb-1">Варианты доставки</label>
                  <select 
                    name="delivery_method" 
                    className="form-select p-2" 
                    value={formData.delivery_method} 
                    onChange={handleInputChange}
                  >
                    <option value="BISHKEK">Курьерская доставка по Бишкеку (+200 сом)</option>
                    <option value="CDEK">Регионы Кыргызстана / СНГ через СДЭК (+400 сом)</option>
                  </select>
                </div>
              )}

              <div className="col-12">
                <label className="form-label small fw-semibold text-muted mb-1">
                  {deliveryType === 'PICKUP' ? 'Адрес пункта выдачи' : 'Адрес доставки *'}
                </label>
                <textarea 
                  name="delivery_address" 
                  className="form-control" 
                  rows="3" 
                  readOnly={deliveryType === 'PICKUP'}
                  placeholder={
                    formData.delivery_method === 'BISHKEK' 
                      ? "Укажите улицу, номер дома, номер квартиры в Бишкеке" 
                      : "Укажите ваш город (например, Ош), точный адрес или код пункта выдачи СДЭК"
                  }
                  required 
                  value={formData.delivery_address} 
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-muted mb-1">Комментарий к заказу</label>
                <textarea 
                  name="comment" 
                  className="form-control" 
                  rows="2" 
                  placeholder={deliveryType === 'PICKUP' ? "Укажите желаемую дату и время, когда заберете заказ..." : "Пожелания по времени курьера, особенности проезда..."} 
                  value={formData.comment} 
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn w-100 fw-bold py-3 mt-4 text-uppercase shadow-sm text-white border-0"
            style={{ backgroundColor: '#1a1d20', letterSpacing: '1px' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#ffc107'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1d20'}
          >
            Подтвердить заказ
          </button>
        </div>

      
         {/* ПРАВАЯ ЧАСТЬ: Состав заказа — ОКОНЧАТЕЛЬНЫЙ ФИКС ПРИЛИПАНИЯ */}
        <div className="col-lg-5" style={{ position: 'sticky', top: '24px', zIndex: 10, alignSelf: 'flex-start' }}>
          <div className="card p-4 border shadow-sm bg-white rounded">
            <h4 className="fw-bold mb-4 text-uppercase border-bottom pb-2 text-dark fs-5">Ваш заказ</h4>

            <ul className="list-group list-group-flush mb-3 bg-transparent overflow-y-auto" style={{ maxHeight: '240px' }}>
              {cart.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0 border-light-subtle py-3">
                  <div style={{ maxWidth: '75%' }}>
                    <h6 className="my-0 fw-bold text-dark text-truncate" style={{ maxWidth: '240px' }}>{item.title}</h6>
                    <small className="text-secondary">{item.quantity} шт. × {Number(parsePrice(item.price)).toLocaleString('ru-RU')} сом</small>
                  </div>
                  <span className="fw-bold text-dark">
                    {(parsePrice(item.price) * item.quantity).toLocaleString('ru-RU')} сом
                  </span>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between text-secondary small mb-2 pt-2 border-top">
              <span>Стоимость товаров:</span>
              <span className="fw-semibold text-dark">{getCartTotal().toLocaleString('ru-RU')} сом</span>
            </div>

            <div className="d-flex justify-content-between text-secondary small mb-3">
              <span>Стоимость доставки:</span>
              <span className="fw-semibold text-dark">
                {deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} сом`}
              </span>
            </div>

            <div className="d-flex justify-content-between h4 fw-bold text-dark pt-3 border-top">
              <span>Итого к оплате:</span>
              <span className="text-success fw-bold">{finalTotalSum.toLocaleString('ru-RU')} сом</span>
            </div>
            
            {/* ИСПРАВЛЕНО: Заменили неверный класс style-italic на валидный Bootstrap-класс fst-italic */}
            <small className="text-muted d-block mt-3 text-center fst-italic" style={{ fontSize: '0.8rem' }}>
              {deliveryType === 'PICKUP' 
                ? '* Оплата производится при получении в филиале клиники' 
                : '* Оплата производится при получении (Курьеру в Бишкеке или в ПВЗ СДЭК)'}
            </small>
          </div>
        </div>

      </form>
    </div>
  );
}
