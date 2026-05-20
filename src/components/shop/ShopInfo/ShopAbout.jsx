import React from 'react';
import { Link } from 'react-router-dom';
// ИСПРАВЛЕНО: Правильно выходим наверх к папке ShopMainDetails и берем хук useShop вместо провайдера
import { useShop } from "../ShopMainDetails/ShopContext";
 
import './shopInfo.css';

export default function ShopAbout() {
  // Если в будущем понадобятся данные из контекста (например, searchQuery), 
  // ты сможешь достать их вот так: const { searchQuery } = useShop();

  return (
    <div className="container info-page-content py-4">
      
      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="shop-breadcrumbs mb-3 small text-muted">
        <Link to="/shop" className="text-decoration-none text-success">
          Главная магазина
        </Link>
        <span className="breadcrumbs-separator mx-2">/</span>
        <span className="breadcrumbs-current text-dark">О магазине</span>
      </div>

      <h1 className="mb-4 fw-bold">О магазине</h1>
      
      <div className="about-text">
        <p className="lead">
          <strong>Огулов Центр</strong> – учебно-оздоровительный центр, основанный 19 октября 1995 года А.Т. Огуловым. Мы специализируемся на распространении методик висцеральной практики и комплексного оздоровления организма.
        </p>
        <p>
          В нашем официальном интернет-магазине представлена только оригинальная, сертифицированная продукция, одобренная лично Александром Тимофеевичем Огуловым и ведущими специалистами центра.
        </p>
        
        <h3 className="mt-4 mb-3 fw-bold">Наши направления:</h3>
        <ul className="lh-lg shop-info-list">
          <li>Продажа методической литературы и уникальных наглядных плакатов проекционных зон.</li>
          <li>Поставка приборов электрохимической очистки воды ПВВК-1 для домашнего использования.</li>
          <li>Продукция на основе микросфер для эффективной реабилитации.</li>
          <li>Специализированные инструменты: вакуумные банки, медные и костяные скребки Гуаша.</li>
        </ul>
        
        <div className="about-accent-block mt-4 p-4 rounded text-center" style={{ backgroundColor: '#e8f5e9', borderLeft: '5px solid var(--ogulov-green)' }}>
          <h4 className="mb-0 fw-semibold text-success">Откройте с нами новое качество жизни и естественного здоровья!</h4>
        </div>
      </div>
    </div>
  );
}
