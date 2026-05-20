import React from 'react';
import { Link } from 'react-router-dom'; 
import { useShop } from "../ShopMainDetails/ShopContext";

import '../shop.css';

export default function ShopDelivery() {
  return (
    <div className="container info-page-content py-4">
      
      {/* ХЛЕБНЫЕ КРОШКИ  */}
      <div className="shop-breadcrumbs mb-3 small text-muted">
        <Link to="/shop" className="text-decoration-none text-success">
          Главная магазина
        </Link>
        <span className="breadcrumbs-separator mx-2">/</span>
        <span className="breadcrumbs-current text-dark">Доставка</span>
      </div>

      <h1 className="mb-4 fw-bold">Доставка продукции</h1>
      
      <div className="about-text">
        <p className="lead">
          Мы осуществляем оперативную доставку учебно-оздоровительной литературы, плакатов и оборудования Представительства А.Т. Огулова по всему региону и странам СНГ.
        </p>
        
        <h3 className="mt-4 fw-bold fs-5 text-success">1. Доставка по городу Бишкек</h3>
        <ul>
          <li><strong>Курьерская доставка:</strong> Осуществляется в течение 1–2 рабочих дней со дня подтверждения заказа менеджером.</li>
          <li><strong>Самовывоз:</strong> Вы можете забрать оплаченный заказ самостоятельно из нашего локального пункта выдачи филиала.</li>
        </ul>
        
        <h3 className="mt-4 fw-bold fs-5 text-success">2. Доставка в регионы и страны СНГ</h3>
        <p>
          Отправка в другие города и страны выполняется надежными транспортными компаниями и логистическими службами:
        </p>
        <ul>
          <li><strong>Транспортные компании (СДЭК, Boxberry и др.):</strong> Самый быстрый способ доставки до пункта выдачи заказов (ПВЗ) или прямо до вашей двери.</li>
          <li><strong>Почта:</strong> Отправка посылок и мелких пакетов в любые, даже самые удаленные населенные пункты.</li>
        </ul>
        
        <div className="about-accent-block mt-4 p-4 rounded bg-light border-start border-danger" style={{ borderLeftWidth: '5px' }}>
          <h5 className="mb-0 fw-semibold text-danger">
            📦 Внимание: Отправка заказов в регионы транспортными компаниями производится только после 100% предоплаты заказа на сайте.
          </h5>
        </div>
      </div>
    </div>
  );
}
