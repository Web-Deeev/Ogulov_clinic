import React from 'react';
import { Link } from 'react-router-dom'; 
import { useShop } from "../ShopMainDetails/ShopContext";

import './shopInfo.css';


export default function ShopPayment() {
  return (
    <div className="container info-page-content py-4">
      
      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="shop-breadcrumbs mb-3 small text-muted">
        <Link to="/shop" className="text-decoration-none text-success">
          Главная магазина
        </Link>
        <span className="breadcrumbs-separator mx-2">/</span>
        <span className="breadcrumbs-current text-dark">Оплата</span>
      </div>

      <h1 className="mb-4 fw-bold">Условия оплаты</h1>
      
      <div className="about-text">
        <p className="lead">
          В интернет-магазине Представительства А.Т. Огулова доступны безопасные и удобные способы оплаты учебно-методической литературы и оздоровительной продукции.
        </p>
        
        <h3 className="mt-4 fw-bold fs-5 text-success">1. Оплата банковскими картами на сайте</h3>
        <p>
          Вы можете мгновенно и без комиссии оплатить заказ онлайн при помощи карт систем 
          <strong> МИР, VISA, Mastercard</strong>. Все платежи проходят через защищенный шлюз банка-эквайера.
        </p>
        
        <h3 className="mt-4 fw-bold fs-5 text-success">2. Электронные платежные системы</h3>
        <p>
          Доступна быстрая оплата через Систему быстрых платежей (СБП) по QR-коду, а также с помощью популярных электронных кошельков.
        </p>
        
        <h3 className="mt-4 fw-bold fs-5 text-success">3. Безналичный расчет для юридических лиц</h3>
        <p>
          Если вы оформляете заказ от имени организации, при оформлении выберите тип плательщика «Юридическое лицо». Наш менеджер сформирует и вышлет счет на оплату. Полный комплект закрывающих документов (УПД) будет отправлен вместе с товаром.
        </p>
        
        <div className="about-accent-block mt-4 p-4 rounded text-center" style={{ backgroundColor: '#e8f5e9', borderLeft: '5px solid var(--ogulov-green)' }}>
          <h4 className="mb-0 fw-semibold text-success">
            🔒 Безопасность данных: Все транзакции шифруются по протоколу SSL. Мы не собираем и не храним данные ваших банковских карт.
          </h4>
        </div>
      </div>
    </div>
  );
}
