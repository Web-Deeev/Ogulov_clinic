import React from 'react';
import './shop.css';

export default function ShopAbout({ setCurrentView }) {
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
        <span className="breadcrumbs-current">О магазине</span>
      </div>

      <h1>О магазине</h1>
      
      <div className="about-text">
        <p>
          <strong>Огулов Центр</strong> – учебно-оздоровительный中心, основанный 19 октября 1995 года А.Т. Огуловым. Мы специализируемся на распространении методик висцеральной практики и комплексного оздоровления организма.
        </p>
        <p>
          В нашем официальном интернет-магазине представлена только оригинальная, сертифицированная продукция, одобренная лично Александром Тимофеевичем Огуловым и ведущими специалистами центра.
        </p>
        <h3>Наши направления:</h3>
        <ul>
          <li>Продажа методической литературы и уникальных наглядных плакатов проекционных зон.</li>
          <li>Поставка приборов электрохимической очистки воды ПВВК-1 для домашнего использования.</li>
          <li>Продукция на основе микросфер для эффективной реабилитации.</li>
          <li>Специализированные инструменты: вакуумные банки, медные и костяные скребки Гуаша.</li>
        </ul>
        <div className="about-accent-block">
          <h4>Откройте с нами новое качество жизни и естественного здоровья!</h4>
        </div>
      </div>
    </div>
  );
}
