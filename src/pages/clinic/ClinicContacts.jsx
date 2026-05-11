import React from 'react';

import { NavLink } from 'react-router-dom';
import './clinic.css';

export default function ClinicContacts() {
  return (
    <div className="clinic-page">
     



      {/* Заголовок страницы */}
      <section className="clinic-banner">
        <h1>Контакты</h1>
        <p>Свяжитесь с нами удобным способом или посетите клинику лично</p>
      </section>

      {/* Контактная информация */}
      <section className="clinic-contacts container">
        <div className="contact-item">
          <h3>Адрес</h3>
          <p>Москва, проспект Маршала Жукова, д. 78, корп. 4 и корп. 2</p>
        </div>

        <div className="contact-item">
          <h3>Режим работы</h3>
          <p>Пн-Пт: 10:00-21:00<br/>Сб: 10:00-18:00<br/>Вс: выходной</p>
        </div>

        <div className="contact-item">
          <h3>Телефон</h3>
          <p><a href="tel:+78005504795">8 800 550-47-95</a></p>
        </div>

        <div className="contact-item">
          <h3>Социальные сети</h3>
          <div className="socials">
            <a href="https://www.facebook.com/ogulov.center" target="_blank" rel="noopener noreferrer" className="social">
              Facebook
            </a>
            <a href="#" className="social">VK</a>
            <a href="#" className="social">Instagram</a>
            <a href="#" className="social">YouTube</a>
          </div>
        </div>

        {/* При желании можно добавить карту */}
        <div className="contact-item">
          <h3>Карта проезда</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!..." 
            width="100%" 
            height="350" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy"
            title="Карта клиники"
          ></iframe>
        </div>
      </section>
    </div>
  );
}