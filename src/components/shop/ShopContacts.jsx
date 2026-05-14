import React from 'react';
import './shop.css';

export default function ShopContacts({ setCurrentView }) {
  return (
    <div className="container info-page-content">
      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="shop-breadcrumbs">
        <a 
          href="#home" 
          onClick={(e) => { 
            e.preventDefault(); 
            if (typeof setCurrentView === 'function') setCurrentView('home'); 
          }}
        >
          Главная
        </a>
        <span className="breadcrumbs-separator">/</span>
        <span className="breadcrumbs-current">Контакты</span>
      </div>

      <h1>Контакты</h1>
      
      <div className="about-text">
        <p>
          Свяжитесь с нами любым удобным для вас способом. Менеджеры Представительства А.Т. Огулова готовы ответить на ваши вопросы и помочь с оформлением заказа.
        </p>

        <h3>📞 Связаться с нами</h3>
        <ul>
          <li><strong>Наш телефон:</strong> <a href="tel:+996XXXXXXXXX">+996 (XXX) XX-XX-XX</a></li>
          <li><strong>Электронная почта:</strong> <a href="mailto:shop@domain.com">shop@domain.com</a></li>
          <li><strong>Мессенджеры:</strong> <a href="t.me" target="_blank" rel="noreferrer">Telegram</a> / <a href="wa.me" target="_blank" rel="noreferrer">WhatsApp</a></li>
        </ul>

        <h3>⏰ Режим работы</h3>
        <ul>
          <li><strong>Понедельник – пятница:</strong> с 10:00 до 18:00</li>
          <li><strong>Суббота, воскресенье:</strong> выходные дни</li>
        </ul>
        <p><em>Оформление заказов на сайте доступно круглосуточно.</em></p>

        <h3>📍 Адрес филиала и пункта выдачи</h3>
        <p>
          г. Бишкек, [Улица, Дом, Номер офиса/кабинета].
        </p>

        <h3>📄 Реквизиты организации</h3>
        <ul>
          <li><strong>Наименование:</strong> ОсОО «[Название компании]»</li>
          <li><strong>Директор:</strong> [ФИО руководителя]</li>
          <li><strong>ИНН:</strong> [9 или 14 знаков]</li>
          <li><strong>Расчетный счет:</strong> [Номер счета]</li>
          <li><strong>Банк:</strong> [Название банка]</li>
          <li><strong>БИК:</strong> [Номер БИК]</li>
        </ul>

        <div className="about-accent-block">
          <h4>
            📦 Внимание: Отгрузка и отправка товаров осуществляются исключительно после 100% предоплаты заказа на сайте.
          </h4>
        </div>
      </div>
    </div>
  );
}
