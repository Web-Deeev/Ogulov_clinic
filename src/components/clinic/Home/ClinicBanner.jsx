import { useEffect, useState } from 'react';
import { clinicApi } from '@/api/clinic/clinic'; 
import './ClinicBanner.css';

/**
 * Динамический промо-баннер главной страницы.
 * SOLID/KISS: Чистый рендеринг без отладочного мусора.
 */
export default function ClinicBanner() {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Запрос к Django REST Framework через слой сервисов clinicApi
  useEffect(() => {
    clinicApi.getBannerSlides()
      .then((response) => {
        const result = response?.data ? response.data : response;

        if (Array.isArray(result) && result.length > 0) {
          setSlides(result);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('❌ Ошибка загрузки баннеров:', err);
        setIsLoading(false);
      });
  }, []);

  // 2. Автопереключение слайдов
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((current) =>
        current === slides.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // 3. Формирование абсолютного URL медиафайлов
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `http://127.0.0.1:8000${path}`;
  };

  // ПРЕДОХРАНИТЕЛЬ (KISS): На время загрузки или при пустой базе отдаем чистый скелетон
  if (isLoading || slides.length === 0) {
    return <div className="clinic-hero-skeleton" style={{ height: '600px', background: 'transparent' }} />;
  }

  const activeSlide = slides[activeIndex];

  return (
    <section
      className="clinic-hero"
      style={{
        backgroundImage: `url(${getImageUrl(activeSlide.image)})`,
      }}
    >
      <div className="clinic-hero__overlay"></div>

      <div className="container clinic-hero__inner">
        <div className="clinic-hero__content">
          {activeSlide.subtitle && <span className="clinic-hero__subtitle">{activeSlide.subtitle}</span>}
          
          <h1>{activeSlide.title}</h1>
          <p className="clinic-hero__text">{activeSlide.text}</p>

          <a href={activeSlide.link} className="clinic-hero__btn">
            {activeSlide.button_text || 'Подробнее'}
          </a>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="clinic-hero__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={
                index === activeIndex
                  ? 'clinic-hero__dot clinic-hero__dot--active'
                  : 'clinic-hero__dot'
              }
              onClick={() => setActiveIndex(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
