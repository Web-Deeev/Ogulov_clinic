import React, { useContext } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';

const OrderHistory = () => {
  // Вытаскиваем userOrders. Защищаем кодом: если в контексте пусто, ставим по дефолту пустой массив []
  const { userOrders = [] } = useContext(ShopContext);

  // Хелпер для Bootstrap бейджей статуса из Django DRF
  const getStatusBadge = (status) => {
    const badges = {
      processing: 'bg-warning text-dark',
      shipped: 'bg-info text-dark',
      delivered: 'bg-success text-white',
      canceled: 'bg-danger text-white'
    };
    const labels = { 
      processing: 'В обработке', 
      shipped: 'Отправлен', 
      delivered: 'Доставлен', 
      canceled: 'Отменён' 
    };
    return (
      <span className={`badge ${badges[status] || 'bg-secondary'} px-3 py-2 rounded-pill fw-medium`}>
        {labels[status] || status}
      </span>
    );
  };

  // БЕЗОПАСНЫЙ хелпер форматирования ISO-даты и времени от Django
  const formatOrderDate = (isoString) => {
    if (!isoString) return 'Дата неизвестна';
    try {
      const date = new Date(isoString);
      // Проверяем, валидна ли дата после парсинга
      if (isNaN(date.getTime())) return 'Некорректная дата';
      
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Ошибка даты';
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-4 text-dark">История ваших заказов</h4>
      
      {userOrders.length === 0 ? (
        <div className="text-muted py-5 text-center bg-light rounded-3 border border-dashed">
          <span className="fs-3 d-block mb-2">📦</span>
          У вас пока нет оформленных заказов.
        </div>
      ) : (
        userOrders.map(order => (
          <div key={order.order_number} className="card mb-4 border-secondary-subtle overflow-hidden shadow-sm rounded-3">
            
            {/* Шапка заказа */}
            <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center py-3 border-bottom-0 gap-2">
              <div>
                <span className="fw-bold text-dark me-2">Заказ {order.order_number}</span>
                <span className="text-muted small d-block d-sm-inline mt-1 mt-sm-0">
                  от {formatOrderDate(order.created_at)}
                </span>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            {/* Содержимое (Массив вложенных товаров с защитой от undefined) */}
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <tbody className="table-group-divider border-top-0">
                    {(order.items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td className="ps-3 py-3" style={{ width: '65%' }}>
                          <span className="fw-semibold text-dark">{item.product_title || 'Товар без названия'}</span>
                        </td>
                        <td className="text-center text-muted py-3">
                          {item.quantity} шт.
                        </td>
                        <td className="text-end pe-3 fw-bold text-nowrap py-3">
                          {Number(item.price_at_purchase || 0).toLocaleString()} сом
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Сводка итогов внизу */}
            <div className="card-footer bg-white d-flex flex-wrap justify-content-between align-items-center py-3 border-top-0 border-top gap-2">
              <span className="text-muted small">
                Способ получения: {order.delivery_method === 'bishkek' ? 'Курьером по Бишкеку' : 'Доставка СДЭК'}
              </span>
              <span className="fw-bold text-dark">
                Итого: <span className="fs-5 text-dark fw-extrabold">{Number(order.total_price || 0).toLocaleString()}</span> сом
              </span>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
