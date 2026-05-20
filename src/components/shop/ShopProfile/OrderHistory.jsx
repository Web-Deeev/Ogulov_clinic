import React, { useContext } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';

const OrderHistory = () => {
  const { userOrders } = useContext(ShopContext);

  // Хелпер для Bootstrap бейджей статуса из Django DRF
  const getStatusBadge = (status) => {
    const badges = {
      processing: 'bg-warning text-dark',
      shipped: 'bg-info text-dark',
      delivered: 'bg-success',
      canceled: 'bg-danger'
    };
    const labels = { 
      processing: 'В обработке', 
      shipped: 'Отправлен', 
      delivered: 'Доставлен', 
      canceled: 'Отменен' 
    };
    return <span className={`badge ${badges[status] || 'bg-secondary'}`}>{labels[status] || status}</span>;
  };

  return (
    <div>
      <h4 className="fw-bold mb-4 text-dark">История ваших заказов</h4>
      
      {userOrders.length === 0 ? (
        <div className="text-muted py-3 text-center">У вас пока нет оформленных заказов.</div>
      ) : (
        userOrders.map(order => (
          <div key={order.order_number} className="card mb-4 border-secondary-subtle overflow-hidden shadow-sm">
            
            {/* Шапка заказа */}
            <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center py-3 border-bottom-0">
              <div>
                <span className="fw-bold text-dark me-2">Заказ {order.order_number}</span>
                <span className="text-muted small">
                  от {new Date(order.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            {/* Содержимое (Массив вложенных товаров) */}
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <tbody className="table-group-divider border-top-0">
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="ps-3 py-3" style={{ width: '65%' }}>
                          <span className="fw-semibold text-dark">{item.product_title}</span>
                        </td>
                        <td className="text-center text-muted py-3">
                          {item.quantity} шт.
                        </td>
                        <td className="text-end pe-3 fw-bold text-nowrap py-3">
                          {Number(item.price_at_purchase).toLocaleString()} сом
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Сводка итогов внизу */}
            <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3 border-top-0 border-top">
              <span className="text-muted small">
                Доставка: {order.delivery_method === 'bishkek' ? 'Курьером по Бишкеку' : 'СДЭК'}
              </span>
              <span className="fw-bold text-dark">
                Итого: <span className="fs-5 text-dark">{Number(order.total_price).toLocaleString()}</span> сом
              </span>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
