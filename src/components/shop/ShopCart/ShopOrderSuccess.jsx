import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function ShopOrderSuccess() {
  const location = useLocation();
  // Пытаемся достать номер заказа из переданного стейта роутера (если он там будет)
  const orderId = location.state?.orderId || null;

  return (
    <div className="container my-5 py-5 text-center text-dark" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm border p-5 bg-white rounded-3">
        {/* Большая зеленая анимированная галочка */}
        <div className="display-1 text-success mb-4">🎉</div>
        
        <h2 className="fw-bold mb-3">Заказ успешно оформлен!</h2>
        
        {orderId ? (
          <p className="text-secondary fs-5 mb-4">
            Номер вашего заказа: <strong className="text-dark">№{orderId}</strong>.
          </p>
        ) : (
          <p className="text-secondary fs-5 mb-4">
            Спасибо за покупку! Заявка принята в обработку.
          </p>
        )}

        <p className="text-muted small mb-4 lh-lg">
          Менеджер клиники Огулова уже получил уведомление и свяжется с вами по указанному номеру телефона в ближайшее время для подтверждения деталей доставки.
        </p>

        <div className="d-flex flex-column gap-2 justify-content-center sm-row">
          <Link to="/shop" className="btn btn-success py-2.5 fw-bold text-uppercase shadow-sm">
            ← Вернуться на витрину
          </Link>
        </div>
      </div>
    </div>
  );
}
