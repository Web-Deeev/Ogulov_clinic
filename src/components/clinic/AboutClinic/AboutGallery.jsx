import React from 'react';
import Slider from '../../components/clinic/ui/Slider.jsx'; 
import './AboutGallerySlider.css';

export default function AboutGallerySlider({ photos, onThumbClick }) {
  // Если на бэкенде нет дополнительных фото для слайдера — просто аккуратно скрываем блок
  if (!photos || photos.length === 0) return null;

  return (
    <section className="about-official__gallery-section" aria-label="Галерея филиала клиники">
      <div className="container">
        <Slider 
          items={photos} 
          title="Галерея нашего центра"
          scrollStep={340} // Используем оригинальный шаг прокрутки под верстку карточек
          renderItem={(photo, index) => (
            <div 
              className="about-official__slider-thumb-wrapper"
              onClick={() => onThumbClick(index)} // 🎯 Прокидываем индекс наверх родителю
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onThumbClick(index);
                }
              }}
            >
              <img 
                src={photo.image} 
                alt={photo.alt_text || "Интерьер клиники Огулова"} 
                className="about-official__slider-img"
                loading="lazy" // Ленивая загрузка для оптимизации перформанса нижних экранов
              />
            </div>
          )}
        />
      </div>
    </section>
  );
}
