import React from 'react';
import { Link } from 'react-router-dom'; // SPA переходы без перезагрузки страницы
import './Footer.css';

const BRAND_DATA = {
  companyName: 'КЛИНИКА ОГУЛОВА',
  legalName: 'ООО "ОГУЛОВ ЦЕНТР"',
  years: '1995–2026',
  innKpp: '7720713407 / 3401001',
  ogrn: '1037739705915',
  address: 'г. Москва, ул. [Уточнить адрес]', 
  phone: '8 (800) 550-47-95',
  phoneHref: 'tel:88005504795',
  email: 'academy@ogulov.org',
  emailHref: 'mailto:academy@ogulov.org'
};

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Трехколоночная сетка */}
      <div className="footer-grid-container">
        
        {/* Колонка 1: О компании и юридические реквизиты */}
        <div className="footer-column">
          <h3 className="footer-title">{BRAND_DATA.companyName}</h3>
          <p className="footer-text footer-copyright">© {BRAND_DATA.years} Все права защищены.</p>
          <div className="footer-legal-box">
            <p>{BRAND_DATA.legalName}</p>
            <p>ИНН/КПП {BRAND_DATA.innKpp}</p>
            <p>ОГРН {BRAND_DATA.ogrn}</p>
          </div>
        </div>

        {/* Колонка 2: Быстрые и кликабельные контакты */}
        <div className="footer-column">
          <h4 className="footer-subtitle">Контакты</h4>
          <p className="footer-text footer-address">{BRAND_DATA.address}</p>
          <p className="footer-text">
            <a href={BRAND_DATA.phoneHref} className="footer-contact-link">
              {BRAND_DATA.phone}
            </a>
          </p>
          <p className="footer-text">
            <a href={BRAND_DATA.emailHref} className="footer-contact-link">
              {BRAND_DATA.email}
            </a>
          </p>
        </div>

        {/* Колонка 3: Юридические документы (SPA-friendly) */}
        <div className="footer-column">
          <h4 className="footer-subtitle">Документы</h4>
          <div className="footer-docs-links">
            <Link to="/user-agreement" className="footer-doc-link">
              Пользовательское соглашение
            </Link>
            <Link to="/privacy-policy" className="footer-doc-link">
              Политика конфиденциальности
            </Link>
          </div>
        </div>

      </div>

      {/* Обязательный медицинский дисклеймер во всю ширину в самом низу */}
      <div className="footer-disclaimer-wrapper">
        <div className="footer-medical-disclaimer">
          ОБ СУЩЕСТВОВАНИИ ПРОТИВОПОКАЗАНИЙ НЕОБХОДИМО ПРОКОНСУЛЬТИРОВАТЬСЯ СО СПЕЦИАЛИСТОМ
        </div>
      </div>
    </footer>
  );
}
