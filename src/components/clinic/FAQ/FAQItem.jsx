import React from 'react';
import './FAQ.css'; 

export default function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`faq-modern-card ${isOpen ? 'faq-modern-card--open' : ''}`}>
      {/* Кликабельная шапка триггерит функцию родителя */}
      <div className="faq-modern-card__header" onClick={onToggle}>
        <h3 className="faq-modern-card__question">{question}</h3>
        <div className="faq-modern-card__arrow-wrapper">
          <span className="faq-modern-card__arrow">‹</span>
        </div>
      </div>

      {/* Выдвижная панель ответа (CSS анимация подхватит класс динамически) */}
      <div className="faq-modern-card__body-wrapper">
        <div className="faq-modern-card__body-content">
          <p className="faq-modern-card__answer">{answer}</p>
        </div>
      </div>
    </div>
  );
}
