import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link для обеспечения принципа SPA
import { clinicApi } from '@/api/clinic/clinic'; 
import './ClinicBanner.css';

export default function ClinicBanner() {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Запрос к API
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

  // 2. Безопасное автопереключение слайдов (KISS / Защита от выхода за границы)
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `http://127.0.0.1:8000${path}`;
  };

  // 3. Жесткий продакшн-барьер загрузки (Предотвращает цикл до наполнения стейта)
  if (isLoading || !Array.isArray(slides) || slides.length === 0) {
    return <div className="clinic-hero-skeleton" style={{ height: '600px', background: '#f5f5f5' }} />;
  }

  // Извлекаем слайд только когда массив гарантированно не пустой
  const activeSlide = slides[activeIndex];

  // Дополнительный ручной предохранитель сущности
  if (!activeSlide) return null;

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
          {activeSlide.subtitle && (
            <span className="clinic-hero__subtitle">{activeSlide.subtitle}</span>
          )}
          
          <h1>{activeSlide.title || 'Заголовок слайда'}</h1>
          <p className="clinic-hero__text">{activeSlide.text || activeSlide.short_desc || ''}</p>

          {/* 4. Безопасная SPA-обработка ссылки с бэкенда */}
          {activeSlide.link && (
            <>
              {activeSlide.link.startsWith('http') ? (
                // Если админ ввел внешнюю ссылку (например, на YouTube) — открываем в новой вкладке
                <a 
                  href={activeSlide.link} 
                  className="clinic-hero__btn"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {activeSlide.button_text || 'Подробнее'}
                </a>
              ) : (
                // Если ссылка внутренняя (например, /clinic/methods) — мгновенный переход без перезагрузки
                <Link to={activeSlide.link} className="clinic-hero__btn">
                  {activeSlide.button_text || 'Подробнее'}
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* 5. Чистая пагинация без лишнего технического текста */}
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
              /* Кнопка внутри абсолютно пустая — это убирает текст "Pagination Слайды баннера" */
            />
          ))}
        </div>
      )}
    </section>
  );
}
