import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clinicApi } from '../../../api/clinic/clinic'; 
import Lightbox from '../ui/Lightbox.jsx';
import BookingModal from '../ui/BookingModal.jsx';
import './CardPage.css';
import './MethodCard.css';
import './MethodGallery.css';

// Изолированная утилита парсинга ссылок YouTube по SOLID (SRP)
const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);
  return match && match[2].length === 11 ? `https://youtube.com{match[2]}` : cleanUrl;
};

export default function MethodDetailPage() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  // Исцеление Race Condition: гарантируем актуальность данных при медленной сети
  useEffect(() => {
    let isCurrentRequest = true;
    setLoading(true);

    clinicApi.getMethodBySlug(id)
      .then(response => {
        if (isCurrentRequest) {
          setMethod(response.data);
        }
      })
      .catch(error => {
        console.error("Ошибка загрузки данных методики:", error);
        if (isCurrentRequest) {
          setMethod(null);
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setLoading(false);
        }
      });

    return () => {
      isCurrentRequest = false; // Отменяем старый запрос при размонтировании/смене id
    };
  }, [id]);

  // Вычисляемые свойства (Защита данных / Defensive Coding)
  const additionalPhotos = method?.gallery || [];
  const pageTitle = method?.title || method?.name || 'Методика оздоровления';
  const mainPhoto = method?.image || 'https://placehold.co';
  const fullText = method?.full_desc || method?.description || method?.short_desc || 'Описание находится в процессе наполнения.';

  // Навигация по галерее (Чистые функции без побочных эффектов)
  const showPrev = () => {
    if (additionalPhotos.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? additionalPhotos.length - 1 : prev - 1));
  };

  const showNext = () => {
    if (additionalPhotos.length <= 1) return;
    setActiveImageIndex((prev) => (prev === additionalPhotos.length - 1 ? 0 : prev + 1));
  };
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  const handleBooking = () => {
    setIsBookingOpen(true);
  };

  if (loading) {
    return (
      <div className="method-detail-status-container" style={{ padding: '100px 0', textAlign: 'center', color: '#70655c' }} aria-busy="true">
        Загрузка данных методики...
      </div>
    );
  }

  if (!method) {
    return (
      <div className="method-detail-status-container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#2c2520', marginBottom: '20px' }}>Методика не найдена</h2>
        <button 
          type="button" 
          className="method-detail__back-btn" 
          onClick={() => navigate('/clinic/methods')}
        >
          Вернуться к списку методик
        </button>
      </div>
    );
  }

  return (
    <section className="method-detail-page">
      <div className="container">
        
        <button 
          type="button" 
          className="method-detail__back-btn" 
          onClick={() => navigate('/clinic/methods')}
        >
          <span className="method-detail__back-arrow" aria-hidden="true">&larr;</span> Назад к списку методик
        </button>

        {/* 1. СВЕРХУ: Баннер */}
        <header className="method-detail__top-hero">
          <img src={mainPhoto} alt="" className="method-detail__hero-img" />
          <div className="method-detail__hero-overlay">
            <span className="method-detail__badge">Методика оздоровления</span>
            <h1 className="method-detail__title">{pageTitle}</h1>
          </div>
        </header>

        {/* 2. ПО ЦЕНТРУ: Двухколоночная структура */}
        <div className="method-detail__two-columns">
          
          {/* ЛЕВАЯ КОЛОНКА: Текст */}
          <article className="method-detail__text-column">
            <h2 className="method-detail__section-title">Суть и медицинские показания</h2>
            <p className="method-detail__fullbio-text" style={{ whiteSpace: 'pre-line' }}>
              {fullText}
            </p>
          </article>
          
          {/* ПРАВАЯ КОЛОНКА: Sticky-эффект */}
          <aside className="method-detail__visual-column">
            <div className="method-detail__side-photo-wrapper">
              <img src={mainPhoto} alt={pageTitle} className="method-detail__side-photo" />
            </div>
            <div className="method-detail__cta-box">
              <button 
                type="button" 
                className="method-detail__cta-btn" 
                onClick={handleBooking}
              >
                Записаться на консультацию
              </button>
            </div>
          </aside>

        </div>

        {/* 3. ГАЛЕРЕЯ ПРЕВЬЮ: Статичная сетка на странице, запускающая лайтбокс */}
        {additionalPhotos.length > 0 && (
          <section className="method-gallery-section" aria-label="Галерея процесса">
            <h2 className="method-gallery-title">Процесс проведения практики</h2>
            <div className="method-gallery-title-line" aria-hidden="true"></div>
            <div className="method-gallery-grid" role="list">
              {additionalPhotos.map((item, index) => {
                const imgSource = item?.image || item; 
                return (
                  <button 
                    key={`gallery-item-${item?.id || index}`} 
                    type="button"
                    className="method-gallery-thumb-wrapper"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Открыть изображение ${index + 1} в полноэкранном режиме`}
                    role="listitem"
                  >
                    <img src={imgSource} alt="" className="method-gallery-thumb" loading="lazy" />
                    <div className="method-gallery-thumb-overlay">
                      <span className="method-gallery-zoom-icon" aria-hidden="true">🔍</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}


        <BookingModal 
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          targetName={pageTitle} 
          targetId={method?.id}  
          apiEndpoint={clinicApi.createLead}
        />

        {/* 4. ЧИСТЫЙ ИНТЕГРИРОВАННЫЙ ЛАЙТБОКС */}
        <Lightbox 
          photos={additionalPhotos}
          activeIndex={activeImageIndex}
          onClose={() => setActiveImageIndex(null)}
          onPrev={showPrev}
          onNext={showNext}
        />

        {/* 5. YOUTUBE VIDEO */}
        {method.video_url && method.video_url.trim() !== "" && (
          <section className="method-detail__media-section" aria-label="Видео-обзор">
            <h2 className="method-detail__block-title">Видео-обзор методики</h2>
            <div className="method-detail__video-box">
              <iframe 
                src={getYouTubeEmbedUrl(method.video_url)} 
                title={`Видео-обзор: ${pageTitle}`} 
                className="method-detail__iframe"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin" 
              ></iframe>
            </div>
          </section>
        )}

      </div>
    </section>
  );
}
