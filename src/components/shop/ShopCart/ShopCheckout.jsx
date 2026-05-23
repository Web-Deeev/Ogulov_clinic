import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../ShopMainDetails/ShopContext'; 
import CheckoutRecipient from './CheckoutRecipient.jsx';
import CheckoutDelivery from './CheckoutDelivery.jsx';
import CheckoutSummary from './CheckoutSummary.jsx';
import './cart.css';

export default function ShopCheckout() {
  // Добавляем получение userProfile из глобального контекста магазина
  const { cart = [], getCartTotal, clearCart, userProfile } = useShop();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState('DELIVERY');
  const [savedUserAddress, setSavedUserAddress] = useState('');
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '+996 ', 
    delivery_method: 'BISHKEK',
    delivery_address: '',
    comment: ''
  });

  // --- ЛОГИКА СБОРА СОХРАНЁННЫХ АДРЕСОВ ДЛЯ БЫСТРОГО ВЫБОРА ---
  const savedAddresses = [];
  if (userProfile?.address) {
    savedAddresses.push(userProfile.address); // Добавляем основной адрес из профиля
  }

  const extraAddrs = localStorage.getItem('ogulov_additional_addresses');
  if (extraAddrs) {
    // Разворачиваем дополнительные адреса, созданные в личном кабинете
    savedAddresses.push(...JSON.parse(extraAddrs));
  }

  const parsePrice = (priceVal) => {
    if (!priceVal) return 0;
    if (typeof priceVal === 'number') return priceVal;
    const clean = priceVal.toString().replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };

  const deliveryCost = deliveryType === 'PICKUP' ? 0 : (formData.delivery_method === 'BISHKEK' ? 200 : 400);
  const finalTotalSum = getCartTotal() + deliveryCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && !value.startsWith('+996 ')) return;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'delivery_address' && deliveryType === 'DELIVERY') setSavedUserAddress(value);
  };

  const handleTypeTabChange = (type) => {
    setDeliveryType(type);
    setFormData(prev => ({
      ...prev,
      delivery_address: type === 'PICKUP' ? 'г. Бишкек, Филиал клиники профессора Огулова А.Т.' : savedUserAddress
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Ваша корзина пуста!");
    if (formData.phone.replace(/\s+/g, '').length < 13) return alert("Введите корректный телефон!");

    const djangoOrderPayload = {
      customer_name: formData.customer_name.trim(),
      phone: formData.phone.replace(/\s+/g, ''), 
      delivery_method: deliveryType === 'PICKUP' ? 'PICKUP' : formData.delivery_method,
      delivery_address: formData.delivery_address.trim(),
      comment: formData.comment.trim(),
      delivery_amount: deliveryCost,
      total_amount: finalTotalSum,
      currency: "KGS",
      items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price_at_purchase: parsePrice(item.price) }))
    };

    if (clearCart) clearCart(); 
    navigate('/shop/order-success', { state: { orderId: Math.floor(1000 + Math.random() * 9000), totalSum: finalTotalSum } }); 
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="container text-center py-5 my-5">
        <div className="fs-1 mb-3">📦</div>
        <h2 className="mb-3 fw-bold">Нет товаров для оформления</h2>
        <Link to="/shop" className="btn fw-bold px-4 py-2" style={{ backgroundColor: '#d9a74a', color: '#fff' }}>Вернуться в каталог</Link>
      </div>
    );
  }

  return (
    <div className="container py-4 text-dark" style={{ maxWidth: '1140px' }}>
      <nav className="small mb-4 text-muted">
        <Link to="/shop" className="text-decoration-none text-secondary">Главная</Link>
        <span className="mx-2">/</span>
        <span className="text-dark fw-semibold">Оформление заказа</span>
      </nav>

      <form onSubmit={handleSubmit} className="row g-4 align-items-start">
        <div className="col-lg-7">
          <CheckoutRecipient formData={formData} handleInputChange={handleInputChange} />
          
          {/* ИСПРАВЛЕНО: Передаем новые пропсы для связи с адресами личного кабинета */}
          <CheckoutDelivery 
            deliveryType={deliveryType} 
            formData={formData} 
            handleTypeTabChange={handleTypeTabChange} 
            handleInputChange={handleInputChange} 
            savedAddresses={savedAddresses}
            onSelectSavedAddress={(selectedAddr) => {
              // По клику на кнопку адреса реактивно обновляем поле в форме и локальный сейв адреса
              setFormData(prev => ({ ...prev, delivery_address: selectedAddr }));
              setSavedUserAddress(selectedAddr);
            }}
          />
          
          <button type="submit" className="btn w-100 fw-bold py-3 mt-4 text-uppercase text-white border-0" style={{ backgroundColor: '#1a1d20' }}>Подтвердить заказ</button>
        </div>
        <CheckoutSummary cart={cart} getCartTotal={getCartTotal} deliveryCost={deliveryCost} finalTotalSum={finalTotalSum} deliveryType={deliveryType} parsePrice={parsePrice} />
      </form>
    </div>
  );
}
