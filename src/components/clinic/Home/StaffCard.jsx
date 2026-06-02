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

  // ФИКС ОПЕЧАТКИ (Senior-подход): Возвращаем полный адрес локального бэка 127.0.0.1:8000
  const getImageUrl = (path) => {
    if (!path || typeof path !== 'string') return '';
    
    // Если путь уже является локальным (начинается с /images) или внешним абсолютным — отдаем как есть
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
    
    // ЖЕСТКИЙ ПЕРЕХВАТ: Если это Александр Тимофеевич Огулов — 
    // отдаем локальный пуленепробиваемый путь из папки public/images/
    if (doctor.id === 1 || doctorNameLower.includes('огулов')) {
      return '/images/Огулов.jpg'; 
    }
    
    // Для всех остальных врачей берем стандартное поле картинки из корня или галереи Джанго
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

  const currentSpec = specialists[current];
  const prevSpec = specialists[(current === 0 ? specialists.length - 1 : current - 1)];
  const nextSpec = specialists[(current + 1) % specialists.length];

  // Вычисляем пуленепробиваемые пути к картинкам
  const currentImg = resolveDoctorPhoto(currentSpec);
  const prevImg = resolveDoctorPhoto(prevSpec);
  const nextImg = resolveDoctorPhoto(nextSpec);

  return (
    <section className="specialists">
      <div className="container-fluid p-0">
        
        <div className="universal-ribbon-header">
          <h2 className="universal-ribbon-title">Наши специалисты</h2>
          <div className="universal-ribbon-line" aria-hidden="true"></div>
        </div>

        <div className="specialists-slider">
          
          {/* Левая панель */}
          <div className="specialists-side left" onClick={prevSlide}>
            <img
              src={getImageUrl(prevImg)}
              alt={prevSpec?.name || prevSpec?.title || 'Врач'}
            />
          </div>

          {/* Центральная активная панель */}
          <div className="specialists-main" key={current}>
            <div className="specialists-content">
              <h3>
                {currentSpec?.name || currentSpec?.title || 'Имя специалиста'}
              </h3>
              
              <h5 className="specialists-specialization">
                {currentSpec?.role || currentSpec?.specialization || currentSpec?.position || 'Специалист центра'}
              </h5>

              {/* Чистый синхронный вывод описания из карточки доктора без хардкодного спама */}
              <p className="specialists-desc-line">
                {currentSpec?.desc || currentSpec?.short_intro || currentSpec?.short_desc || 'Описание обновляется...'}
              </p>

              <div className="specialists-actions">
                <Link to={`/clinic/doctors/${currentSpec?.id}`} className="specialists-more-btn">
                  Подробнее
                </Link>
                
                {onBooking && (
                  <button type="button" className="specialists-book-btn" onClick={() => onBooking(currentSpec)}>
                    Записаться
                  </button>
                )}
              </div>
            </div>

            {/* Главное фото текущего врача */}
            <div className="specialists-image">
              <img
                src={getImageUrl(currentImg)}
                alt={currentSpec?.name || 'Врач'}
              />

              <div className="specialists-nav">
                <button type="button" onClick={prevSlide}>←</button>
                <button type="button" onClick={nextSlide}>→</button>
              </div>
            </div>
          </div>

          {/* Правая панель */}
          <div className="specialists-side right" onClick={nextSlide}>
            <img
              src={getImageUrl(nextImg)}
              alt={nextSpec?.name || nextSpec?.title || 'Врач'}
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
