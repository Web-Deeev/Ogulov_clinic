import React from 'react';
import { Link } from 'react-router-dom'; 
import { useShop } from "../ShopMainDetails/ShopContext";

import '../shop.css';

export default function ShopContacts() {
  return (
    <div className="container info-page-content py-4">
      
      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="shop-breadcrumbs mb-3 small text-muted">
        <Link to="/shop" className="text-decoration-none text-success">
          Главная магазина
        </Link>
        <span className="breadcrumbs-separator mx-2">/</span>
        <span className="breadcrumbs-current text-dark">Контакты</span>
      </div>

      <h1 className="mb-4 fw-bold">Контакты</h1>
      
      <div className="about-text">
        <p className="lead">
          Свяжитесь с нами любым удобным для вас способом. Менеджеры Представительства А.Т. Огулова готовы ответить на ваши вопросы и помочь с оформлением заказа.
        </p>

        <h3 className="mt-4 fw-bold fs-5 text-success">📞 Связаться с нами</h3>
        <ul>
          <li><strong>Наш телефон:</strong> <a href="tel:+996XXXXXXXXX" className="text-success text-decoration-none">+996 (XXX) XX-XX-XX</a></li>
          <li><strong>Электронная почта:</strong> <a href="mailto:shop@domain.com" className="text-success text-decoration-none">shop@domain.com</a></li>
          <li><strong>Мессенджеры:</strong> <a href="https://t.me" target="_blank" rel="noreferrer" className="text-success text-decoration-none">Telegram</a> / <a href="https://wa.me" target="_blank" rel="noreferrer" className="text-success text-decoration-none">WhatsApp</a></li>
        </ul>

        <h3 className="mt-4 fw-bold fs-5 text-success">⏰ Режим работы</h3>
        <ul>
          <li><strong>Понедельник – пятница:</strong> с 10:00 до 18:00</li>
          <li><strong>Суббота, воскресенье:</strong> выходные дни</li>
        </ul>
        <p><em>Оформление заказов на сайте доступно круглосуточно.</em></p>

        <h3 className="mt-4 fw-bold fs-5 text-success">📍 Адрес филиала и пункта выдачи</h3>
        <p>
          г. Бишкек, [Улица, Дом, Номер офиса/кабинета].
        </p>

        <h3 className="mt-4 fw-bold fs-5 text-success">📄 Реквизиты организации</h3>
        <ul>
          <li><strong>Наименование:</strong> ОсОО «[Название компании]»</li>
          <li><strong>Директор:</strong> [ФИО руководителя]</li>
          <li><strong>ИНН:</strong> [9 или 14 знаков]</li>
          <li><strong>Расчетный счет:</strong> [Номер счета]</li>
          <li><strong>Банк:</strong> [Название банка]</li>
          <li><strong>БИК:</strong> [Номер БИК]</li>
        </ul>

        <div className="about-accent-block mt-4 p-4 rounded bg-light border-start border-danger" style={{ borderLeftWidth: '5px' }}>
          <h5 className="mb-0 fw-semibold text-danger">
            📦 Внимание: Отгрузка и отправка товаров осуществляются исключительно после 100% предоплаты заказа на сайте.
          </h5>
        </div>
      </div>
    </div>
  );
}
