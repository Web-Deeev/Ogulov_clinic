import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Slider.css'; 

export default function Slider({ 
  items = [], 
  renderItem, 
  title = "",
  scrollStep = 340,
  viewAllLink = "", 
  viewAllText = "Посмотреть все"
}) {
  const sliderRef = useRef(null);

  // KISS: Если элементов нет, полностью спим
  if (!items || items.length === 0) return null;

  // Функция бесконечного навигационного шага
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      
      if (direction === 'right') {
        const isEnd = scrollLeft + clientWidth >= scrollWidth - 15;
        sliderRef.current.scrollTo({
          left: isEnd ? 0 : scrollLeft + scrollStep,
          behavior: 'smooth'
        });
      } else {
        const isStart = scrollLeft <= 15;
        sliderRef.current.scrollTo({
          left: isStart ? scrollWidth : scrollLeft - scrollStep,
          behavior: 'smooth'
        });
      }
    }
  };

  // 🎯 СМАРТ-ХЕЛПЕР (Фикс дублирования путей):
  // Проверяем, если ссылка уже абсолютная или содержит префикс /clinic, не трогаем её.
  // Иначе — мягко подставляем базовый роут клиники.
  const getCorrectLink = (link) => {
    if (!link) return "";
    if (link.startsWith('/clinic') || link.startsWith('/shop') || link.startsWith('http')) {
      return link;
    }
    return `/clinic${link}`;
  };

  return (
    <div className="universal-ribbon-section">
      {title && (
        <div className="universal-ribbon-header">
          <h2 className="universal-ribbon-title">{title}</h2>
          <div className="universal-ribbon-line" aria-hidden="true"></div>
        </div>
      )}

      <div className="universal-slider-wrapper">
        {/* Левая стрелка */}
        {items.length > 1 && (
          <button 
            type="button"
            className="universal-side-arrow universal-side-arrow--left" 
            onClick={() => handleScroll('left')}
            aria-label="Назад"
          >
            ‹
          </button>
        )}

        {/* Нативная лента */}
        <div className="universal-native-slider" ref={sliderRef} role="list">
          {items.map((item, index) => (
            <div key={item.id || index} className="universal-native-slide" role="listitem">
              {renderItem(item, index)}
            </div>
          ))}
        </div>

        {/* Правая стрелка */}
        {items.length > 1 && (
          <button 
            type="button"
            className="universal-side-arrow universal-side-arrow--right" 
            onClick={() => handleScroll('right')}
            aria-label="Вперед"
          >
            ›
          </button>
        )}
      </div>

      {/* ЧЕСТНАЯ КНОПКА ПОД СЛАЙДЕРОМ — ТЕПЕРЬ С ПУЛЕНЕПРОБИВАЕМЫМ РОУТИНГОМ */}
      {viewAllLink && (
        <div className="universal-slider-action">
          <Link 
            to={getCorrectLink(viewAllLink)} // 🎯 Применяем наш смарт-хелпер
            className="universal-slider-view-all-btn"
          >
            {viewAllText}
          </Link>
        </div>
      )}
    </div>
  );
}

Slider.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  title: PropTypes.string,
  scrollStep: PropTypes.number,
  viewAllLink: PropTypes.string,
  viewAllText: PropTypes.string
};