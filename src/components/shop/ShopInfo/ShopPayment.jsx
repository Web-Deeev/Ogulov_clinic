import React from 'react';
import { Link } from 'react-router-dom'; 
import { useShop } from "../ShopMainDetails/ShopContext";

import './shopInfo.css';


export default function ShopPayment() {
  // Хук готов к интеграции эквайринга или калькулятора валют
  // const { cart } = useShop();

  return (
    <div className="container info-page-content py-4" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      
      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="shop-breadcrumbs mb-3 small text-muted">
        <Link to="/shop" className="text-decoration-none text-success fw-medium">
          Главная магазина
        </Link>
        <span className="breadcrumbs-separator mx-2">/</span>
        <span className="breadcrumbs-current text-dark">Оплата</span>
      </div>

      <h1 className="mb-4 fw-bold">Условия оплаты</h1>
      
      <div className="about-text">
        <p className="lead text-secondary">
          В официальном интернет-магазине Представительства А.Т. Огулова в Кыргызстане реализованы безопасные, современные и удобные способы онлайн-оплаты оздоровительной продукции.
        </p>
        
        <h3 className="mt-4 fw-bold fs-5 text-success">1. Оплата банковскими картами (Онлайн-эквайринг)</h3>
        <p className="text-secondary ps-2">
          Вы можете мгновенно и без комиссии оплатить заказ на сайте картами платёжных систем 
          <strong> Элкарт, VISA, Mastercard</strong>. Обработка платежей осуществляется через защищённый шлюз банка-партнёра (ЗАО «ЭкоИсламикБанк»).
        </p>
        
        <h3 className="mt-4 fw-bold fs-5 text-success">2. Мобильный банкинг и Электронные кошельки</h3>
        <p className="text-secondary ps-2">
          Для быстрой оплаты со смартфона доступны переводы по QR-коду через национальные платёжные приложения и кошельки: 
          <strong> O!Деньги, MegaPay, Balance.kg, Элсом</strong>, а также через мобильные банкинги коммерческих банков КР.
        </p>
        
        <h3 className="mt-4 fw-bold fs-5 text-success">3. Безналичный расчёт для юридических лиц</h3>
        <p className="text-secondary ps-2">
          При оформлении заказа от имени организации или медицинского учреждения выберите тип плательщика «Юридическое лицо». Наш бухгалтер сформирует и выставит счёт на оплату. Полный комплект закрывающих документов (электронная счёт-фактура (ЭСФ), акты, накладные) будет предоставлен при передаче товара.
        </p>
        
        {/* 🛡️ Внедрён надёжный фолбэк для цвета границы */}
        <div 
          className="about-accent-block mt-4 p-4 rounded bg-light border-start shadow-sm" 
          style={{ 
            backgroundColor: '#e8f5e9', 
            borderLeft: '5px solid var(--ogulov-green, #198754)' 
          }}
        >
          <h5 className="mb-0 fw-semibold text-success d-flex align-items-center gap-2">
            <span>🔒</span> Безопасность данных: Все транзакции шифруются по международному протоколу SSL (PCI DSS стандарта). Магазин не собирает, не видит и не хранит данные ваших банковских карт.
          </h5>
        </div>
      </div>
    </div>
  );
}