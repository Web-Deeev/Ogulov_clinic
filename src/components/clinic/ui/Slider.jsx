import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './Slider.css'; // Твой файл стилей для ленты и стрелок

export default function Slider({ 
  items = [], 
  renderItem, 
  title = "",
  scrollStep = 340
}) {
  const sliderRef = useRef(null);

  // KISS: Если элементов нет, полностью спим
  if (!items || items.length === 0) return null;

  // Функция бесконечного навигационного шага
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      
      if (direction === 'right') {
        // Защита продакшена: если дошли до правого края (запас < 15px) — плавно прыгаем в начало (0)
        const isEnd = scrollLeft + clientWidth >= scrollWidth - 15;
        
        sliderRef.current.scrollTo({
          left: isEnd ? 0 : scrollLeft + scrollStep,
          behavior: 'smooth'
        });
      } else {
        // Защита продакшена: если мы у левого края (скролл < 15px) — плавно прыгаем в самый конец
        const isStart = scrollLeft <= 15;
        
        sliderRef.current.scrollTo({
          left: isStart ? scrollWidth : scrollLeft - scrollStep,
          behavior: 'smooth'
        });
      }
    }
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
        {/* Левая стрелка: видна всегда, если в массиве больше одного элемента */}
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

        {/* Правая стрелка: видна всегда, если в массиве больше одного элемента */}
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
    </div>
  );
}

Slider.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  title: PropTypes.string,
  scrollStep: PropTypes.number
};
