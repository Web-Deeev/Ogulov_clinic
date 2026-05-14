import React from 'react';
import './shop.css';

export default function ShopDelivery({ setCurrentView }) {
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
        <span className="breadcrumbs-current">Доставка</span>
      </div>

      <h1>Доставка продукции</h1>
      
      <div className="about-text">
        <p>
          We осуществляем оперативную доставку учебно-оздоровительной литературы, плакатов и оборудования Представительства А.Т. Огулова по всему региону и странам СНГ.
        </p>
        <h3>1. Доставка по городу Бишкек</h3>
        <ul>
          <li><strong>Курьерская доставка:</strong> Осуществляется в течение 1–2 рабочих дней со дня подтверждения заказа менеджером.</li>
          <li><strong>Самовывоз:</strong> Вы можете забрать оплаченный заказ самостоятельно из нашего локального пункта выдачи филиала.</li>
        </ul>
        <h3>2. Доставка в регионы и страны СНГ</h3>
        <p>
          Отправка в другие города и страны выполняется надежными транспортными компаниями и логистическими службами:
        </p>
        <ul>
          <li><strong>Транспортные компании (СДЭК, Boxberry и др.):</strong> Самый быстрый способ доставки до пункта выдачи заказов (ПВЗ) или прямо до вашей двери.</li>
          <li><strong>Почта:</strong> Отправка посылок и мелких пакетов в любые, даже самые удаленные населенные пункты.</li>
        </ul>
        <div className="about-accent-block">
          <h4>
            📦 Внимание: Отправка заказов в регионы транспортными компаниями производится только после 100% предоплаты заказа на сайте.
          </h4>
        </div>
      </div>
    </div>
  );
}
