import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Lightbox.css'; 

export default function Lightbox({ 
  photos = [], 
  activeIndex = null, 
  onClose, 
  onPrev, 
  onNext 
}) {
  // Вычисляем валидность индекса (Защита от падения / Defensive Coding)
  const isVisible = activeIndex !== null && photos.length > 0 && activeIndex >= 0 && activeIndex < photos.length;

  // Автоматическая блокировка прокрутки основного сайта при просмотре
  useEffect(() => {
    if (!isVisible) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isVisible]);

  if (!isVisible) return null;

  // Парсинг источника картинки (читает и строку, и объект {image: '...'})
  const currentItem = photos[activeIndex];
  const currentPhotoSrc = currentItem?.image || currentItem;

  return (
    <div 
      className="premium-lightbox-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Кнопка закрытия */}
      <button 
        type="button" 
        className="premium-lightbox-close" 
        onClick={onClose}
        aria-label="Закрыть галерею"
      >
        &times;
      </button>

      {/* Стрелка Назад */}
      {photos.length > 1 && (
        <button 
          type="button"
          className="premium-lightbox-arrow premium-lightbox-arrow--left" 
          onClick={(e) => { e.stopPropagation(); onPrev(); }} // Защита: глушим клик, чтобы окно не закрывалось
          aria-label="Предыдущее фото"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}

      {/* Контентная зона: Фото + Счетчик */}
      <div className="premium-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img 
          src={currentPhotoSrc} 
          alt="Увеличенное изображение процесса" 
          className="premium-lightbox-image" 
        />
        <div className="premium-lightbox-counter" aria-live="polite">
          <span className="premium-lightbox-counter-current">{activeIndex + 1}</span>
          <span className="premium-lightbox-counter-divider">/</span>
          <span className="premium-lightbox-counter-total">{photos.length}</span>
        </div>
      </div>

      {/* Стрелка Вперед */}
      {photos.length > 1 && (
        <button 
          type="button"
          className="premium-lightbox-arrow premium-lightbox-arrow--right" 
          onClick={(e) => { e.stopPropagation(); onNext(); }} // Защита: глушим клик
          aria-label="Следующее photo"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
}

Lightbox.propTypes = {
  photos: PropTypes.array.isRequired,
  activeIndex: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
