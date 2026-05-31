import React, { useRef, useState, useEffect } from 'react';
// Импортируем твой готовый компонент карточки методики
import MethodCard from '../Methods/MethodCard.jsx'; 
import './GridMethods.css';

export default function GridMethods({ methods }) {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // KISS: Если методик нет, ничего не рендерим
  if (!methods || methods.length === 0) return null;

  // Функция проверки положения скролла для управления видимостью стрелок
  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      // Если прокрутили больше чем на 10px — показываем левую стрелку
      setShowLeftArrow(scrollLeft > 10);
      // Если запас скролла справа меньше 10px — скрываем правую стрелку
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      // Проверяем позицию при первой загрузке
      checkScrollPosition();
      // Вешаем слушатель на нативный скролл
      slider.addEventListener('scroll', checkScrollPosition);
      // Слушаем ресайз окна на случай изменения ширины экрана
      window.addEventListener('resize', checkScrollPosition);
    }

    return () => {
      if (slider) {
        slider.removeEventListener('scroll', checkScrollPosition);
      }
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [methods]);

  // Функция плавного шага скролла по боковым стрелкам
  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft } = sliderRef.current;
      const scrollAmount = direction === 'left' ? -340 : 340;
      
      sliderRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="doctor-personal__methods-section">
      {/* Шапка секции теперь чистая, без кнопок */}
      <div className="doctor-personal__section-header">
        <h2 className="doctor-personal__block-title">Практикуемые методики лечения</h2>
        <div className="doctor-personal__title-line"></div>
      </div>

      {/* НОВЫЙ АРХИТЕКТУРНЫЙ КАРКАС ДЛЯ АБСОЛЮТНОГО ПОЗИЦИОНИРОВАНИЯ СТРЕЛОК */}
      <div className="doctor-methods-slider-wrapper">
        
        {/* Стрелка ВЛЕВО — позиционируется абсолютно по левому боку */}
        {methods.length > 3 && showLeftArrow && (
          <button 
            className="doctor-methods-side-arrow doctor-methods-side-arrow--left" 
            onClick={() => handleScroll('left')}
            aria-label="Назад"
          >
            ‹
          </button>
        )}

        {/* Нативная лента скролла */}
        <div className="doctor-methods-native-slider" ref={sliderRef}>
          {methods.map((method) => (
            <div key={method.id} className="doctor-methods-native-slide">
              <MethodCard method={method} />
            </div>
          ))}
        </div>

        {/* Стрелка ВПРАВО — позиционируется абсолютно по правому боку */}
        {methods.length > 3 && showRightArrow && (
          <button 
            className="doctor-methods-side-arrow doctor-methods-side-arrow--right" 
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
