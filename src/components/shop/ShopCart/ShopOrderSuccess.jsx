import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti'; // Наш салют
import './ShopOrderSuccess.css';

export default function ShopOrderSuccess() {
  const location = useLocation();
  // Достаем номер заказа из стейта роутера
  const orderId = location.state?.orderId || null;

  useEffect(() => {
    // 🎯 СЕНЬОР-НАСТРОЙКА: Двойной залп пушек из нижних углов экрана вверх
    const duration = 2.5 * 1000; 
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 42, spread: 75, ticks: 80, zIndex: 2000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 45 * (timeLeft / duration);
      
      // Левая пушка
      confetti({ 
        ...defaults, 
        particleCount, 
        angle: 60, 
        origin: { x: randomInRange(0.05, 0.15), y: 0.8 } 
      });
      
      // Правая пушка
      confetti({ 
        ...defaults, 
        particleCount, 
        angle: 120, 
        origin: { x: randomInRange(0.85, 0.95), y: 0.8 } 
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    /* Твой основной каркас верстки */
    <div className="container my-5 py-5 text-center text-dark" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm border p-5 bg-white rounded-3 order-success-card-fade">
        
        {/* 🎯 ТВОЙ UI-ЭФФЕКТ: Нежно-зеленый круг и упругая сочная галочка из черновика */}
        <div className="success-icon-wrapper">
          <div className="success-checkmark">✓</div>
        </div>
        
        <h2 className="fw-bold mb-3 success-title">Заказ успешно оформлен!</h2>
        
        {/* Вывод номера заказа */}
        {orderId ? (
          <p className="text-secondary fs-5 mb-4 success-text">
            Номер вашего заказа: <strong className="text-dark">№{orderId}</strong>.
          </p>
        ) : (
          <p className="text-secondary fs-5 mb-4 success-text">
            Спасибо за покупку! Заявка принята в обработку.
          </p>
        )}

        <p className="text-muted small mb-4 lh-lg success-text">
          Менеджер клиники Огулова уже получил уведомление и свяжется с вами по указанному номеру телефона в ближайшее время для подтверждения деталей доставки.
        </p>

        {/* Твоя колонка кнопок из основного кода, переведенная на новые стили */}
        <div className="d-flex flex-column gap-2 justify-content-center sm-row success-actions">
          <Link to="/shop" className="to-profile-btn text-decoration-none text-uppercase">
            ← Вернуться на витрину
          </Link>
        </div>
      </div>
    </div>
  );
}
