import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clinicApi } from '@/api/clinic/clinic'; 
import './StaffCard.css'; 

/**
 * Staffcard - Высокотехнологичный трехпанельный слайдер специалистов.
 * Полностью синхронизирован с Django REST Framework и принципами SPA.
 */
export default function Staffcard({ onBooking }) {
  const [specialists, setSpecialists] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Асинхронный запрос к вашей базе данных Django через clinicApi
  useEffect(() => {
    clinicApi.getDoctors()
      .then((response) => {
        const result = response?.data ? response.data : response;
        if (Array.isArray(result) && result.length > 0) {
          setSpecialists(result);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('❌ Ошибка загрузки специалистов:', err);
        setIsLoading(false);
      });
  }, []);

  // 2. Безопасная круговая навигация
  const prevSlide = () => {
    if (specialists.length === 0) return;
    setCurrent((prev) => (prev === 0 ? specialists.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (specialists.length === 0) return;
    setCurrent((prev) => (prev + 1) % specialists.length);
  };

  // ФИКС ОПЕЧАТКИ: Динамический и пуленепробиваемый сборщик путей
  const getImageUrl = (path) => {
    if (!path || typeof path !== 'string') return '';
    if (path.startsWith('/') || path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const encodedParts = path.split('/').map(part => encodeURIComponent(part));
    return `http://127.0.0{encodedParts.join('/')}`.replace(/([^:]\/)\/+/g, "$1");
  };

  // СМАРТ-ФОЛБЕК ДЛЯ КАРТИНОК: Прямой и жесткий перехват Огулова на локальный файл проекта
  const resolveDoctorPhoto = (doctor) => {
    if (!doctor) return '';
    
    const doctorNameLower = String(doctor.name || doctor.title || '').toLowerCase();
    
    if (doctor.id === 1 || doctorNameLower.includes('огулов')) {
      return '/images/Огулов.jpg'; 
    }
    
    let rawPhoto = doctor.image || doctor.photo || doctor.avatar || '';
    
    if (!rawPhoto && Array.isArray(doctor.gallery) && doctor.gallery.length > 0) {
      const firstGalleryItem = doctor.gallery[0];
      rawPhoto = firstGalleryItem?.image || firstGalleryItem?.photo || firstGalleryItem || '';
    }
    
    return rawPhoto;
  };

  // Барьер загрузки
  if (isLoading || specialists.length === 0) {
    return <div className="specialists-skeleton" style={{ height: '460px', background: 'transparent' }} />;
  }

  // Находим индексы для трехпанельного отображения
  const prevIndex = current === 0 ? specialists.length - 1 : current - 1;
  const nextIndex = (current + 1) % specialists.length;

  return (
    <section className="specialists">
      <div className="container-fluid p-0">
        
        <div className="universal-ribbon-header">
          <h2 className="universal-ribbon-title">Наши специалисты</h2>
          <div className="universal-ribbon-line" aria-hidden="true"></div>
        </div>

        {/* 3D Пространство слайдера */}
        <div className="specialists-slider 3d-perspective-stage">
          
          {/* Левая интерактивная панель */}
          <div className="specialists-side left" onClick={prevSlide}>
            <img
              src={getImageUrl(resolveDoctorPhoto(specialists[prevIndex]))}
              alt="Предыдущий специалист"
            />
          </div>

          {/* 
            🎯 СЕНЬОР-ФИКС: Рендерим всю колоду/каркас. 
            Позиционирование, глубина (z-index) и сдвиги перекладываются на CSS 
            через классы состояний, полностью исключая стробоскопический эффект.
          */}
          <div className="specialists-deck-scene">
            {specialists.map((spec, index) => {
              let positionClass = 'card-hidden';
              
              if (index === current) positionClass = 'card-active';
              else if (index === prevIndex) positionClass = 'card-prev';
              else if (index === nextIndex) positionClass = 'card-next';

              return (
                <div 
                  key={spec?.id || `doctor-${index}`} 
                  className={`specialists-main ${positionClass}`}
                >
                  <div className="specialists-content">
                    <h3>{spec?.name || spec?.title || 'Имя специалиста'}</h3>
                    <h5 className="specialists-specialization">
                      {spec?.role || spec?.specialization || spec?.position || 'Специалист центра'}
                    </h5>
                    <p className="specialists-desc-line">
                      {spec?.desc || spec?.short_intro || spec?.short_desc || 'Описание обновляется...'}
                    </p>
                    <div className="specialists-actions">
                      <Link to={`/clinic/doctors/${spec?.slug || spec?.id}`} className="specialists-more-btn">
                        Подробнее
                      </Link>
                      {onBooking && (
                        <button type="button" className="specialists-book-btn" onClick={() => onBooking(spec)}>
                          Записаться
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="specialists-image">
                    <img src={getImageUrl(resolveDoctorPhoto(spec))} alt="Врач" />
                    {index === current && (
                      <div className="specialists-nav">
                        <button type="button" onClick={prevSlide}>←</button>
                        <button type="button" onClick={nextSlide}>→</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Правая интерактивная панель */}
          <div className="specialists-side right" onClick={nextSlide}>
            <img
              src={getImageUrl(resolveDoctorPhoto(specialists[nextIndex]))}
              alt="Следующий специалист"
            />
          </div>
        </div>

        <div className="specialists-all">
          <Link to="/clinic/doctors" className="universal-slider-view-all-btn">
            Все специалисты &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
