import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../ShopMainDetails/ShopContext'; 
import CheckoutRecipient from './CheckoutRecipient.jsx';
import CheckoutDelivery from './CheckoutDelivery.jsx';
import CheckoutSummary from './CheckoutSummary.jsx';
import shopService from '@/api/shop'; 
import './cart.css';

export default function ShopCheckout() {
  const { cart = [], clearCart, userProfile } = useShop();
  const navigate = useNavigate();

  // 🛡️ РЕФ ДЛЯ ПРЕДОТВРАЩЕНИЯ RACE CONDITION
  const isProfileLoadedRef = useRef(false);

  const [deliveryType, setDeliveryType] = useState('DELIVERY');
  const [savedUserAddress, setSavedUserAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '+996 ', 
    delivery_method: 'BISHKEK',
    delivery_address: '',
    comment: ''
  });

  // Утилита очистки строки цены (чтобы математика на фронте считала сомы безупречно)
  const parsePrice = (priceVal) => {
    if (!priceVal) return 0;
    if (typeof priceVal === 'number') return priceVal;
    const clean = priceVal.toString().replace(/[^0-9]/g, '');
    return parseInt(clean, 10) || 0;
  };

  // 🛡️ БЕЗОПАСНЫЙ ЛОКАЛЬНЫЙ РАСЧЕТ СУММЫ КОРЗИНЫ
  const localCartSum = cart.reduce((sum, item) => {
    return sum + (parsePrice(item.price) * item.quantity);
  }, 0);

  // =========================================================================
  // 🎯 ПУЛЕНЕПРОБИВАЕМОЕ АВТОПОДТЯГИВАНИЕ (ОДИН РАЗ ЗА ЖИЗНЕННЫЙ ЦИКЛ)
  // =========================================================================
  useEffect(() => {
    if (userProfile && !isProfileLoadedRef.current) {
      // Корректно форматируем телефон из базы под маску фронтенда
      let rawPhone = userProfile.phone || userProfile.username || '';
      let formattedPhone = '+996 ';
      
      if (rawPhone) {
        const cleanRaw = rawPhone.replace(/\s+/g, '');
        if (cleanRaw.startsWith('+')) {
          formattedPhone = cleanRaw;
        } else if (cleanRaw.startsWith('996')) {
          formattedPhone = `+${cleanRaw}`;
        } else {
          formattedPhone = `+996 ${cleanRaw}`;
        }
      }

      const rawFullName = `${userProfile.last_name || ''} ${userProfile.first_name || ''}`.trim();
      const computedFullName = rawFullName || userProfile.name || userProfile.username || prev.customer_name;

      setFormData(prev => ({
        ...prev,
        customer_name: computedFullName, // 👈 Передаем полностью собранное ФИО
        phone: formattedPhone,
        delivery_address: userProfile.address || prev.delivery_address
      }));
      
      if (userProfile.address) {
        setSavedUserAddress(userProfile.address);
      }

      // Флаг поднят: больше изменения userProfile не перезапишут ручной ввод пользователя
      isProfileLoadedRef.current = true;
    }
  }, [userProfile]);

  const savedAddresses = [];
  if (userProfile?.address) {
    savedAddresses.push(userProfile.address);
  }

  const extraAddrs = localStorage.getItem('ogulov_additional_addresses');
  if (extraAddrs) {
    savedAddresses.push(...JSON.parse(extraAddrs));
  }

  const deliveryCost = deliveryType === 'PICKUP' ? 0 : (formData.delivery_method === 'BISHKEK' ? 200 : 400);
  const finalTotalSum = localCartSum + deliveryCost;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Ваша корзина пуста!");
    
    const cleanPhone = formData.phone.replace(/\s+/g, '');
    if (cleanPhone.length < 13) return alert("Введите корректный телефон!");

    setIsSubmitting(true);
    setApiError(null);

    // 🛡️ СБОРКА ПЕЙЛОАДА С ЖЕСТКИМ СОБЛЮДЕНИЕМ SNAKE_CASE ДЛЯ DRF
    const djangoOrderPayload = {
      customer_name: formData.customer_name.trim(),
      phone: cleanPhone, 
      delivery_method: deliveryType === 'PICKUP' ? 'PICKUP' : formData.delivery_method,
      delivery_address: formData.delivery_address.trim(),
      comment: formData.comment.trim(),
      delivery_amount: deliveryCost,
      total_amount: finalTotalSum,
      currency: "KGS",
      // ИСПРАВЛЕНО: Ключ изменен с productId на product_id для сопоставления с сериализатором
      items: cart.map(item => ({ 
        product_id: item.id, 
        quantity: item.quantity 
      }))
    };

    try {
      const response = await shopService.createOrder(djangoOrderPayload);

      if (clearCart) clearCart(); 
      
      navigate('/shop/order-success', { 
        state: { 
          orderId: response.id, 
          totalSum: finalTotalSum 
        } 
      }); 
    
    } catch (err) {
      console.error("Полный ответ бэкенда с ошибкой 400:", err.response?.data);
      
      const serverErrors = err.response?.data;
      let finalErrorMessage = "";

      if (serverErrors && typeof serverErrors === 'object') {
        // 1. Проверяем твои стандартные точечные поля
        const djangoPhoneError = serverErrors.phone?.[0];
        const djangoNameError = serverErrors.customer_name?.[0];
        const djangoGeneralError = serverErrors.detail;

        if (djangoPhoneError) finalErrorMessage = djangoPhoneError;
        else if (djangoNameError) finalErrorMessage = djangoNameError;
        else if (djangoGeneralError) finalErrorMessage = djangoGeneralError;
        else {
          // 2. ФОЛБЭК: Если бэк забраковал другие поля (например, items или delivery_method)
          // Собираем их в читаемый вид: "items: Обязательное поле | currency: ..."
          finalErrorMessage = Object.entries(serverErrors)
            .map(([field, errorVal]) => {
              const msg = Array.isArray(errorVal) ? errorVal[0] : JSON.stringify(errorVal);
              return `${field}: ${msg}`;
            })
            .join(' | ');
        }
      } else {
        finalErrorMessage = "Не удалось связаться с сервером клиники. Проверьте данные.";
      }

      setApiError(finalErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
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

      {apiError && <div className="alert alert-danger py-2 rounded-3 mb-4">{apiError}</div>}

      <form onSubmit={handleSubmit} className="row g-4 align-items-start">
        <div className="col-lg-7">
          <CheckoutRecipient formData={formData} handleInputChange={handleInputChange} />
          
          <CheckoutDelivery 
            deliveryType={deliveryType} 
            formData={formData} 
            handleTypeTabChange={handleTypeTabChange} 
            handleInputChange={handleInputChange} 
            savedAddresses={savedAddresses}
            onSelectSavedAddress={(selectedAddr) => {
              setFormData(prev => ({ ...prev, delivery_address: selectedAddr }));
              setSavedUserAddress(selectedAddr);
            }}
          />
          
          <button 
            type="submit" 
            className="btn w-100 fw-bold py-3 mt-4 text-uppercase text-white border-0 d-flex align-items-center justify-content-center" 
            style={{ backgroundColor: '#1a1d20' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                СОХРАНЕНИЕ В БАЗУ ДАННЫХ...
              </>
            ) : 'Подтвердить заказ'}
          </button>
        </div>
        {/* Передаем локальную отпарсенную сумму для гарантии синхронности интерфейса */}
        <CheckoutSummary 
          cart={cart} 
          getCartTotal={() => localCartSum} 
          deliveryCost={deliveryCost} 
          finalTotalSum={finalTotalSum} 
          deliveryType={deliveryType} 
          parsePrice={parsePrice} 
        />
      </form>
    </div>
  );
}
