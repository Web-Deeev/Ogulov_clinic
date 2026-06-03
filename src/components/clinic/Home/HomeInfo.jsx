import React, { useEffect, useState } from 'react';
import { clinicApi } from '../../../api/clinic/clinic'; 
import Lightbox from '../ui/Lightbox.jsx'; 
import './HomeInfo.css';

export default function AboutClinic() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Стейты управления модальными окнами (Галерея и Видео)
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    clinicApi.getClinicAbout() 
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки данных клиники:', err);
        setError('Не удалось загрузить информацию о клинике');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container" style={{ padding: '40px 0' }}>Загрузка...</div>;
  if (error || !data) return null; 

  const defaultFounderPhoto = '/images/ogulov.jpg';
  const defaultVideoPreview = '/images/about-main.jpg';
  const mainVideoPreviewUrl = data.video_preview || defaultVideoPreview;

  // Фильтруем массив: убираем первую фотографию, чтобы избежать дублирования в нижнем ряду
  const additionalPhotos = data.gallery_images
    ? data.gallery_images.filter((_, index) => index !== 0)
    : [];

  const showPrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? additionalPhotos.length - 1 : prev - 1));
  };

  const showNext = () => {
    setActiveImageIndex((prev) => (prev === additionalPhotos.length - 1 ? 0 : prev + 1));
  };

  // 🟢 СЕНЬОР-ХЕЛПЕР: Парсинг через нативный URL API без ломающихся регулярных выражений
  const getYouTubeEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    
    try {
      const cleanUrl = url.trim();
      // Защита от ссылок, вставленных без указания протокола http/https
      const absoluteUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
      
      const parsedUrl = new URL(absoluteUrl);
      let videoId = null;

      // Сценарий 1: Сокращенный формат ссылок шеринга (youtu.be/ID)
      if (parsedUrl.hostname === 'youtu.be') {
        videoId = parsedUrl.pathname.substring(1);
      } 
      // Сценарий 2: Если в базу по ошибке сохранили уже готовую embed-ссылку
      else if (parsedUrl.pathname.startsWith('/embed/')) {
        videoId = parsedUrl.pathname.split('/embed/')[1];
      } 
      // Сценарий 3: Ссылки на мобильный или десктопный формат Shorts
      else if (parsedUrl.pathname.startsWith('/shorts/')) {
        videoId = parsedUrl.pathname.split('/shorts/')[1];
      }
      // Сценарий 4: Стандартный URL из адресной строки браузера (://youtube.com)
      else {
        videoId = parsedUrl.searchParams.get('v');
      }

      // Дополнительная очистка от хвостов query-параметров в pathname (если сплит захватил лишнее)
      if (videoId && videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
      if (videoId && videoId.includes('/')) {
        videoId = videoId.split('/')[0];
      }

      // Валидация: идентификаторы видео на YouTube всегда строго 11 символов
      if (!videoId || videoId.length !== 11) {
        throw new Error(`Некорректная структура ID видео: ${videoId}`);
      }

      // Сборка строго через бэктэки с маршрутом /embed/ и автоплеем
      return `https://youtube.com{videoId}?autoplay=1&rel=0&enablejsapi=1`;

    } catch (err) {
      // Изолируем ошибку, чтобы некорректный ввод контент-менеджера в Django админке не ломал весь фронт
      console.error('Критическая ошибка парсинга YouTube URL:', err.message);
      return '';
    }
  };

  return (
    <section className="about-clinic">
      <div className="container">
        <div className="about-clinic__grid">
          
          {/* ЛЕВАЯ КОЛОНКА: ОПИСАНИЕ И КАРТОЧКА ОСНОВАТЕЛЯ */}
          <div className="about-clinic__content">
            <h2>{data.title}</h2>
            <p>{data.description}</p>
            <div className="about-clinic__doctor">
              <img src={data.founder_photo || defaultFounderPhoto} alt={data.founder_name} />
              <h3>{data.founder_name}</h3>
              <p>{data.founder_description}</p>
            </div>
            <a href="/about" className="about-clinic__link">Подробнее о клинике →</a>
          </div>

          {/* ПРАВАЯ КОЛОНКА: СЕТКА ФОТОГРАФИЙ И ВИДЕО */}
          <div className="about-clinic__gallery">
            
            {/* Клик по всей области большого превью открывает видео прямо на сайте */}
            <div
              className="about-clinic__video"
              onClick={() => setIsVideoOpen(true)}
              style={{ cursor: 'pointer' }}
            >
              <img src={mainVideoPreviewUrl} alt={data.title} />
              
              {/* Круглая смарт-кнопка YouTube парит в нижнем левом углу */}
              <div 
                className="about-clinic__youtube-float-btn" 
                onClick={(e) => {
                  e.stopPropagation(); // Защита от всплытия ивента и двойного открытия модалки
                  setIsVideoOpen(true);
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            </div>

            {/* Ряд из оставшихся 4-х маленьких фотографий */}
            <div className="about-clinic__photos">
              {additionalPhotos.map((item, index) => (
                <img 
                  key={item.id} 
                  src={item.image} 
                  alt={item.alt_text || "Фото интерьера клиники"} 
                  onClick={() => setActiveImageIndex(index)} 
                  className="gallery-thumb"
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 🟢 МОДАЛЬНОЕ ОКНО ОНЛАЙН-ПЛЕЕРА (С РАЗМЫТИЕМ BACKDROP-FILTER В CSS) */}
      {isVideoOpen && (
        <div className="about-clinic__video-modal" onClick={() => setIsVideoOpen(false)}>
          <div className="video-modal__body" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal__close-btn" onClick={() => setIsVideoOpen(false)}>
              &times;
            </button>
            <div className="video-modal__iframe-wrapper">
              <iframe
                src={getYouTubeEmbedUrl(data.video_url)}
                title="Презентационное видео Огулов Центра"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* СИСТЕМНЫЙ ЛАЙТБОКС ГАЛЕРЕИ ДЛЯ ПРОСМОТРА КАРТИНКИ В ПОЛНЫЙ ЭКРАН */}
      <Lightbox
        photos={additionalPhotos}
        activeIndex={activeImageIndex}
        onClose={() => setActiveImageIndex(null)}
        onPrev={showPrev}
        onNext={showNext}
      />
    </section>
  );
}
