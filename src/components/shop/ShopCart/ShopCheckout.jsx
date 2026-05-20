import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../ShopMainDetails/ShopContext'; 

export default function ShopCheckout() {
  // ИСПРАВЛЕНО: Достаем правильный массив cart, а не старый объект cartItems
  const { cart = [], getCartTotal, clearCart } = useShop();
  const navigate = useNavigate();

  // Состояние формы покупателя
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '+996 ', // Сразу подставляем код страны для Киргизии
    delivery_method: 'BISHKEK', 
    delivery_address: '',
    comment: ''
  });

  // Утилита очистки строки цены (чтобы математика в чеке считала сомы безупречно)
  const parsePrice = (priceVal) => {
    if (!priceVal) return 0;
    if (typeof priceVal === 'number') return priceVal;
    const clean = priceVal.toString().replace(/[^0-9]/g, '');
    return parseInt(clean, 10) || 0;
  };

  // ИСПРАВЛЕНО: Теперь собираем товары под Django напрямую из массива cart без лишних фильтров базы данных!
  const orderItems = cart.map(item => ({
    product_id: item.id,      
    quantity: item.quantity,  
    price_at_purchase: parsePrice(item.price) 
  }));

  // Расчет динамической стоимости доставки
  const deliveryCost = formData.delivery_method === 'BISHKEK' ? 200 : 400;
  
  // Итоговая сумма: чистая стоимость корзины + доставка
  const finalTotalSum = getCartTotal() + deliveryCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Защита кода страны: не даем пользователю стереть префикс "+996 "
    if (name === 'phone' && !value.startsWith('+996 ')) {
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Ваша корзина пуста!");
      return;
    }

    // Валидация длины киргизского номера (минимум 13 символов с учетом +996 и пробела)
    const cleanPhone = formData.phone.replace(/\s+/g, '');
    if (cleanPhone.length < 13) {
      alert("Пожалуйста, введите корректный номер телефона!");
      return;
    }

    // Идеальный вложенный JSON-пакет для бэкенда Django Rest Framework (Nested Serializer)
    const djangoOrderPayload = {
      customer_name: formData.customer_name,
      phone: cleanPhone, 
      delivery_method: formData.delivery_method,
      delivery_address: formData.delivery_address,
      comment: formData.comment,
      delivery_amount: deliveryCost,
      total_amount: finalTotalSum,
      currency: "KGS",
      items: orderItems 
    };

    console.log("=== ГОТОВЫЙ JSON ПАКЕТ ДЛЯ POST-ЗАПРОСА В DJANGO DRF ===");
    console.log(JSON.stringify(djangoOrderPayload, null, 2));
    
    alert(`Заказ успешно сформирован!\nИтого к оплате с учетом доставки: ${finalTotalSum} сом.\nДанные упакованы для API.`);
    
    if (clearCart) clearCart(); 
    navigate('/shop'); 
  };

  // ИСПРАВЛЕНО: Безопасный Guard-выход. Если корзина пуста — показываем красивую заглушку и не ломаем страницу!
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
    <div className="container py-5 text-dark">
      <div className="row g-5">
        
        {/* ЛЕВАЯ ЧАСТЬ: Форма данных покупателя */}
        <div className="col-lg-7">
          <h4 className="mb-4 fw-bold text-uppercase border-bottom pb-2 text-dark">Данные получателя</h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              
              <div className="col-12">
                <label className="form-label small fw-semibold text-muted mb-1">ФИО полностью *</label>
                <input 
                  type="text" 
                  name="customer_name" 
                  className="form-control p-2.5" 
                  placeholder="Иванов Иван Иванович"
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
                  className="form-control p-2.5" 
                  placeholder="+996 555 123 456" 
                  required 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-muted mb-1">Способ доставки</label>
                <select 
                  name="delivery_method" 
                  className="form-select p-2.5" 
                  value={formData.delivery_method} 
                  onChange={handleInputChange}
                >
                  <option value="BISHKEK">Курьерская доставка по Бишкеку (+200 сом)</option>
                  <option value="CDEK">Доставка СДЭК в регионы / СНГ (+400 сом)</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-muted mb-1">Адрес доставки *</label>
                <textarea 
                  name="delivery_address" 
                  className="form-control" 
                  rows="3" 
                  placeholder={
                    formData.delivery_method === 'BISHKEK' 
                      ? "Укажите улицу, номер дома, номер квартиры в Бишкеке" 
                      : "Укажите ваш город и точный адрес или код пункта выдачи СДЭК"
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
                  placeholder="Удобное время для звонка курьера, пожелания..." 
                  value={formData.comment} 
                  onChange={handleInputChange}
                ></textarea>
              </div>

            </div>

            {/* ИСПРАВЛЕНО: Перекрасили кнопку в наше фирменное золото клиники Огулова */}
            <button 
              type="submit" 
              className="btn w-100 fw-bold py-3 mt-4 text-uppercase shadow-sm text-white"
              style={{ backgroundColor: '#d9a74a', borderColor: '#d9a74a' }}
            >
              Подтвердить заказ
            </button>
          </form>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: Состав заказа из массива корзины */}
        <div className="col-lg-5">
          <div className="card p-4 border-0 shadow-sm bg-light rounded-3 sticky-top" style={{ top: '20px', zIndex: 1 }}>
            <h4 className="fw-bold mb-4 text-uppercase border-bottom pb-2 text-dark">Ваш заказ</h4>
            
            <ul className="list-group list-group-flush mb-3 bg-transparent">
              {cart.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0 border-light-subtle py-3">
                  <div>
                    <h6 className="my-0 fw-semibold text-dark">{item.title}</h6>
                    <small className="text-secondary">Кол-во: {item.quantity} шт. х {item.price}</small>
                  </div>
                  <span className="fw-bold text-dark">
                    {(parsePrice(item.price) * item.quantity).toLocaleString()} сом
                  </span>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between text-secondary small mb-2 pt-2 border-top">
              <span>Стоимость товаров:</span>
              <span>{getCartTotal().toLocaleString()} сом</span>
            </div>

            <div className="d-flex justify-content-between text-secondary small mb-3">
              <span>Стоимость доставки:</span>
              <span>{deliveryCost} сом</span>
            </div>

            <div className="d-flex justify-content-between h4 fw-bold text-dark pt-3 border-top border-light-subtle">
              <span>Итого к оплате:</span>
              <span className="text-danger">{finalTotalSum.toLocaleString()} сом</span>
            </div>
            
            <small className="text-muted d-block mt-3 text-center">
              * Оплата производится при получении (Курьеру или в ПВЗ СДЭК)
            </small>
          </div>
        </div>

      </div>
    </div>
  );
}
