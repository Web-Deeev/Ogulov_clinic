import React, { useEffect, useState } from 'react';
import shopService from '@/api/shop';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await shopService.getOrderHistory();
        setOrders(data);
      } catch (err) {
        console.error('Ошибка при загрузке истории:', err);
        setError('Не удалось загрузить историю заказов. Возможно, истекла сессия авторизации.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Парсинг цен с плавающей точкой из Django
  const parsePrice = (priceVal) => {
    if (!priceVal) return 0;
    if (typeof priceVal === 'number') return Math.floor(priceVal);
    const num = parseFloat(priceVal);
    return isNaN(num) ? 0 : Math.floor(num);
  };

  // Вычисление итоговой суммы заказа
  const calculateOrderTotal = (order) => {
    if (order.total_price && parseFloat(order.total_price) > 0) {
      return parsePrice(order.total_price);
    }
    if (order.total_amount && parseFloat(order.total_amount) > 0) {
      return parsePrice(order.total_amount);
    }
    return order.items?.reduce((sum, item) => {
      const price = parsePrice(item.price_at_purchase || item.price);
      return sum + (price * item.quantity);
    }, 0) || 0;
  };

  // Безопасный парсинг сложной текстовой строки доставки
  const parseDeliveryDetails = (rawString) => {
    const fallback = { method: '📦 Доставка', address: rawString, cost: '0 сом', comment: 'Без комментария' };
    if (!rawString || typeof rawString !== 'string') return fallback;

    // 1. Метод доставки
    const isPickup = rawString.includes('[Самовывоз]');
    const method = isPickup ? '🚗 Самовывоз' : '🚚 Курьерская доставка';

    // 2. Вырезаем кусок адреса
    let address = rawString.replace(/\[.*?\]\s*/g, ''); 
    if (address.includes('Адрес:')) {
      address = address.split('Адрес:')[1];
    }
    if (address.includes('. Доставка:')) {
      address = address.split('. Доставка:')[0];
    }

    // 3. Вырезаем стоимость доставки
    let cost = '0 сом';
    if (rawString.includes('Доставка:')) {
      let costPart = rawString.split('Доставка:')[1];
      if (costPart.includes('. Комментарий:')) {
        costPart = costPart.split('. Комментарий:')[0];
      }
      cost = costPart.trim();
    }

    // 4. Вырезаем комментарий
    let comment = 'Без комментария';
    if (rawString.includes('Комментарий:')) {
      comment = rawString.split('Комментарий:')[1]?.trim() || 'Без комментария';
    }

    return { method, address: address.trim(), cost, comment };
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new': return 'bg-primary';
      case 'in_progress': return 'bg-warning text-dark';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#d9a74a' }} role="status"></div>
        <p className="mt-2 text-muted small">Загрузка истории ваших заказов...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger my-3 small rounded-3">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-5 bg-light rounded-3 border">
        <div className="fs-2 mb-2">📦</div>
        <h6 className="fw-bold text-dark mb-1">У вас пока нет заказов</h6>
        <p className="text-muted small mb-0">Все ваши будущие покупки в магазине клиники отобразятся здесь.</p>
      </div>
    );
  }
  return (
    <div className="order-history-container px-2">
      <h4 className="fw-bold text-dark mb-4 position-relative pb-2" style={{ borderBottom: '2px solid #d9a74a', display: 'inline-block' }}>
        История заказов
      </h4>
      
      {orders.map((order) => {
        // Извлекаем структурированные параметры из текстового поля доставки
        const delivery = parseDeliveryDetails(order.delivery_address || order.address);

        return (
          <div key={order.id} className="card shadow-sm border border-secondary-subtle rounded-3 mb-4 overflow-hidden bg-white">
            {/* Шапка одного заказа */}
            <div className="card-header bg-white py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-2 border-bottom-0">
              <div>
                <span className="fw-bold text-dark me-2">Заказ №{order.id}</span>
                <span className="text-muted small">
                  от {new Date(order.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <span className={`badge ${getStatusBadgeClass(order.status)} px-3 py-2 rounded-pill fw-semibold small`}>
                {order.status_display || order.status}
              </span>
            </div>

            {/* Тело заказа со списком купленных позиций */}
            <div className="card-body px-4 pt-0 pb-3">
              <div className="list-group list-group-flush border-top border-bottom mb-3">
                {order.items?.map((item) => {
                  const productTitle = item.product?.title || item.product_title || 'Товар';
                  const productImage = item.product?.image || item.product_image;
                  const itemPrice = parsePrice(item.price_at_purchase || item.price);
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div key={item.id} className="list-group-item px-0 py-3 bg-transparent d-flex align-items-center justify-content-between gap-3">
                      <div className="d-flex align-items-center gap-3 text-truncate" style={{ maxWidth: '75%' }}>
                        {productImage && (
                          <img 
                            src={productImage} 
                            alt={productTitle} 
                            className="img-fluid rounded border bg-white"
                            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                          />
                        )}
                        <div className="text-truncate">
                          <h6 className="small fw-bold text-dark mb-0 text-truncate">{productTitle}</h6>
                          <span className="text-muted extra-small">
                            {itemPrice.toLocaleString('ru-RU')} сом × {item.quantity} шт.
                          </span>
                        </div>
                      </div>
                      <span className="fw-bold text-dark small text-nowrap">
                        {itemTotal.toLocaleString('ru-RU')} сом
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Итоговая финансовая информация по чеку */}
              <div className="d-flex flex-column align-items-end mb-3 px-1 small">
                {(order.delivery_amount > 0 || order.delivery_price > 0) && (
                  <div className="text-muted">
                    Доставка: <span>{parsePrice(order.delivery_amount || order.delivery_price).toLocaleString('ru-RU')} сом</span>
                  </div>
                )}
                <div className="fw-bold text-dark fs-6 mt-1">
                  Итого к оплате: <span style={{ color: '#d9a74a' }}>{calculateOrderTotal(order).toLocaleString('ru-RU')} сом</span>
                </div>
              </div>

              {/* 🟢 ИСПРАВЛЕНО: Чистая анкетная структура параметров вместо сплошной строки текста */}
              {(order.delivery_address || order.address) && (
                <div className="p-3 bg-light rounded-3 border small text-secondary mt-3">
                  <span className="fw-bold text-dark d-block mb-2.5" style={{ color: '#d9a74a' }}>
                    📋 Параметры получения и доставки:
                  </span>
                  
                  <div className="d-flex flex-column gap-2 text-dark">
                    <div className="d-flex justify-content-between align-items-start border-bottom border-light pb-1.5 gap-3">
                      <span className="text-muted flex-shrink-0">Способ получения:</span>
                      <span className="fw-semibold text-end">{delivery.method}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-start border-bottom border-light pb-1.5 gap-3">
                      <span className="text-muted flex-shrink-0">Адрес доставки:</span>
                      <span className="fw-semibold text-end" style={{ maxWidth: '70%' }}>{delivery.address}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-start border-bottom border-light pb-1.5 gap-3">
                      <span className="text-muted flex-shrink-0">Расчёт доставки:</span>
                      <span className="fw-semibold text-end">{delivery.cost}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <span className="text-muted flex-shrink-0">Комментарий:</span>
                      <span className="fw-semibold text-muted text-end" style={{ fontStyle: 'italic', maxWidth: '70%' }}>
                        {delivery.comment}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
