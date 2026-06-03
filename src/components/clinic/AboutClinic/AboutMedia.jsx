import React, { useState } from 'react';
import Slider from '../ui/Slider.jsx'; 
import Lightbox from '../ui/Lightbox.jsx';

export default function AboutMedia({ gallery = [] }) {
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  // Слайдер крутит фотографии, начиная со 2-й, так как 1-я ушла на обложку видео наверх
  const sliderPhotos = gallery.slice(1);

  return (
    <div className="about-official__media-block">
      {/* 1. ГАЛЕРЕЯ-СЛАЙДЕР */}
      {sliderPhotos.length > 0 && (
        <div className="about-official__bottom-gallery-slider" style={{ marginTop: '24px' }}>
          <Slider 
            items={sliderPhotos} 
            title="Галерея нашего центра"
            scrollStep={340} 
            renderItem={(photo, index) => (
              <div 
                key={photo.id || index}
                className="about-official__slider-thumb-wrapper"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(index);
                }}
              >
                <img src={photo.image} alt="Интерьер клиники" loading="lazy" />
              </div>
            )}
          />
        </div>
      )}

      {/* 2. СИСТЕМНЫЙ ЛАЙТБОКС */}
      {activeImageIndex !== null && (
        <Lightbox 
          photos={sliderPhotos} 
          activeIndex={activeImageIndex} 
          onClose={() => setActiveImageIndex(null)} 
          onPrev={() => setActiveImageIndex(p => p === 0 ? sliderPhotos.length - 1 : p - 1)}
          onNext={() => setActiveImageIndex(p => p === sliderPhotos.length - 1 ? 0 : p + 1)}
        />
      )}
    </div>
  );
}
