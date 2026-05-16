import React from 'react';
import { Link } from 'react-router-dom'; 
import './shop.css';

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
          {/* Ссылки на будущие страницы авторизации */}
          <Link to="/shop/login">Вход</Link>
          <Link to="/shop/register">Регистрация</Link>
          <Link to="/shop/forgot-password">Забыли пароль?</Link>
        </div>

        {/* Блок 3: Социальные сети Представительства */}
        <div className="shop-footer-col">
          <h4>Мы в соц сетях</h4>
          <a href="https://ok.ru" target="_blank" rel="noreferrer">Одноклассники</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
        </div>
      </div>

      {/* Нижня плашка со значками платежных систем */}
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
