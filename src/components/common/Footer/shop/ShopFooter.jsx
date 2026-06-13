import React from 'react';
import { Link } from 'react-router-dom'; 
import './ShopFooter.css';

export default function ShopFooter() {
  return (
    <footer className="shop-footer">
      <div className="container shop-footer-inner">
        {/* Блок 1: Навигация по инфо-страницам */}
        <div className="shop-footer-col">
          <h4>Информация</h4>
          <Link to="/shop/about">О магазине</Link>
          <Link to="/shop/payment">Оплата</Link>
          <Link to="/shop/delivery">Доставка</Link>
          <Link to="/shop/contacts">Контакты</Link>
        </div>

        {/* Блок 2: Личный кабинет покупателя */}
        <div className="shop-footer-col">
          <h4>Личный кабинет</h4>
          <Link to="/shop/auth">Вход в кабинет</Link>
          <Link to="/shop/profile/orders">Мои заказы</Link>
          <Link to="/shop/profile/favorites">Избранное</Link>
        </div>

        {/* Блок 3: Мессенджеры с правильными иконками */}
        <div className="shop-footer-col">
          <h4>Связаться с нами</h4>
          <div className="d-flex flex-column gap-2">
            <a 
              href="https://wa.me" 
              target="_blank" 
              rel="noreferrer"
              className="d-flex align-items-center text-decoration-none footer-social-link whatsapp-color"
            >
              <i className="bi bi-whatsapp me-2 fs-5"></i>
              <span>WhatsApp</span>
            </a>

            <a 
              href="https://t.me" 
              target="_blank" 
              rel="noreferrer"
              className="d-flex align-items-center text-decoration-none footer-social-link telegram-color"
            >
              <i className="bi bi-telegram me-2 fs-5"></i>
              <span>Telegram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Нижняя плашка со значками платежных систем */}
      <div className="shop-payments container">
        <div className="shop-payments-inner">
          <span className="pay-badge mircard">МИР</span>
          <span className="pay-badge visa">VISA</span>
          <span className="pay-badge mastercard">Mastercard</span>
        </div>
      </div>
    </footer>
  );
}
