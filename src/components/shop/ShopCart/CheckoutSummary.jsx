import React from 'react';

export default function CheckoutSummary({ cart, getCartTotal, deliveryCost, finalTotalSum, deliveryType, parsePrice }) {
  return (
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
        
        <small className="text-muted d-block mt-3 text-center fst-italic" style={{ fontSize: '0.8rem' }}>
          {deliveryType === 'PICKUP' 
            ? '* Оплата производится при получении в филиале клиники' 
            : '* Оплата производится при получении (Курьеру в Бишкеке или в ПВЗ СДЭК)'}
        </small>
      </div>
    </div>
  );
}
