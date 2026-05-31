import React, { useState } from 'react';
// Поднимаемся на 2 уровня вверх из src/pages/clinic/, заходим в components/clinic/FAQ/
import FAQItem from '../../components/clinic/FAQ/FAQItem.jsx'; 
import { faqData } from '../../components/clinic/FAQ/FaqData.js'; 

export default function ClinicFAQ() {
  // Храним ИНДЕКС открытого вопроса в массиве. -1 означает, что все закрыты.
  const [activeIndex, setActiveIndex] = useState(-1);

  const toggleFAQ = (index) => {
    // Жесткая проверка: если кликнули на уже открытый индекс — закрываем (-1), иначе открываем новый
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  // Проверка на случай, если моки сломаны или массив пуст
  if (!Array.isArray(faqData) || faqData.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p>Вопросы и ответы обновляются...</p>
      </div>
    );
  }

  return (
    <div className="clinic-faq-page">
      
      {/* Премиальный верхний баннер страницы */}
      <section className="clinic-banner">
        <div className="container">
          <h1 className="clinic-banner__title">Вопрос-ответ</h1>
          <p className="clinic-banner__subtitle">Ответы на самые часто задаваемые вопросы наших пациентов</p>
        </div>
      </section>

      {/* Контейнер списка современных закругленных карточек */}
      <section className="faq-container container">
        <div className="faq-modern-list">
          {faqData.map((item, index) => (
            <FAQItem 
              key={`faq-item-${index}`} // Используем индекс для стабильного ключа в DOM
              question={item.question} 
              answer={item.answer} 
              isOpen={activeIndex === index} // Жесткое сравнение по индексам в обход кривых ID
              onToggle={() => toggleFAQ(index)} // Передаем индекс текущей итерации
            />
          ))}
        </div>
      </section>

    </div>
  );
}
