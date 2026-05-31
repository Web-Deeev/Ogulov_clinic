import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { clinicApi } from '../../../api/clinic/clinic'; 
import './CardPage.css';
import './MethodCard.css';
import './MethodGallery.css';


export default function MethodDetailPage() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    clinicApi.getMethodBySlug(id)
      .then(response => {
        setMethod(response.data);
      })
      .catch(error => {
        console.error("Ошибка загрузки данных методики:", error);
        setMethod(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    
    if (match && match.length === 11) {
      return `https://youtube.com{match[1]}`;
    }
    return cleanUrl;
  };

  const additionalPhotos = method?.gallery || [];

  const showPrev = (e) => {
    e.stopPropagation(); 
    setActiveImageIndex((prev) => (prev === 0 ? additionalPhotos.length - 1 : prev - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === additionalPhotos.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center', color: '#70655c' }}>
        Загрузка данных методики...
      </div>
    );
  }

  if (!method) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#2c2520', marginBottom: '20px' }}>Методика не найдена</h2>
        <button className="method-detail__back-btn" onClick={() => navigate('/clinic/methods')}>
          Вернуться к списку методик
        </button>
      </div>
    );
  }

  const pageTitle = method.title || method.name || 'Методика оздоровления';
  const mainPhoto = method.image || 'https://placehold.co';
  const fullText = method.full_desc || method.description || method.short_desc || 'Описание находится в процессе наполнения.';

  return (
    <section className="method-detail-page">
      <div className="container">
        
        <button className="method-detail__back-btn" onClick={() => navigate('/clinic/methods')}>
          <span className="method-detail__back-arrow">&larr;</span> Назад к списку методик
        </button>

        {/* 1. СВЕРХУ: Баннер */}
        <div className="method-detail__top-hero">
          <img src={mainPhoto} alt={pageTitle} className="method-detail__hero-img" />
          <div className="method-detail__hero-overlay">
            <span className="method-detail__badge">Методика оздоровления</span>
            <h1 className="method-detail__title">{pageTitle}</h1>
          </div>
        </div>

        {/* 2. ПО ЦЕНТРУ: Твоя оригинальная двухколоночная структура */}
        <div className="method-detail__two-columns">
          
          {/* ЛЕВАЯ КОЛОНКА: Текст */}
          <div className="method-detail__text-column">
            <h2 className="method-detail__section-title">Суть и медицинские показания</h2>
            <p className="method-detail__fullbio-text" style={{ whiteSpace: 'pre-line' }}>
              {fullText}
            </p>
          </div>
          
          {/* ПРАВАЯ КОЛОНКА: Сюда добавили плавающий эффект через CSS sticky */}
          <div className="method-detail__visual-column">
            <div className="method-detail__side-photo-wrapper">
              <img src={mainPhoto} alt={pageTitle} className="method-detail__side-photo" />
            </div>
            <div className="method-detail__cta-box">
              <button className="method-detail__cta-btn" onClick={() => alert(`Заявка по методике: ${pageTitle}`)}>
                Записаться на консультацию
              </button>
            </div>
          </div>

        </div>

        {/* 3. ГАЛЕРЕЯ ПРЕВЬЮ */}
        {additionalPhotos.length > 0 && (
          <div className="method-gallery-section">
            <h2 className="method-gallery-title">Процесс проведения практики</h2>
            <div className="method-gallery-title-line"></div>
            <div className="method-gallery-grid">
              {additionalPhotos.map((item, index) => {
                const imgSource = item?.image || item; 
                return (
                  <div 
                    key={`gallery-item-${item?.id || index}`} 
                    className="method-gallery-thumb-wrapper"
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={imgSource} alt="Превью" className="method-gallery-thumb" loading="lazy" />
                    <div className="method-gallery-thumb-overlay">
                      <span className="method-gallery-zoom-icon">🔍</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. ЛАЙТБОКС (ПОРТАЛ В BODY) */}
     {activeImageIndex !== null && additionalPhotos[activeImageIndex] && (
          <div className="method-lightbox-overlay" onClick={() => setActiveImageIndex(null)}>
            <button className="method-lightbox-close" onClick={() => setActiveImageIndex(null)}>&times;</button>

            {additionalPhotos.length > 1 && (
              <button className="method-lightbox-arrow method-lightbox-arrow--left" onClick={showPrev}>‹</button>
            )}

            <div className="method-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img 
                src={additionalPhotos[activeImageIndex]?.image || additionalPhotos[activeImageIndex]} 
                alt="Увеличенное фото процесса" 
                className="method-lightbox-image" 
              />
              <div className="method-lightbox-counter">
                {activeImageIndex + 1} / {additionalPhotos.length}
              </div>
            </div>

            {additionalPhotos.length > 1 && (
              <button className="method-lightbox-arrow method-lightbox-arrow--right" onClick={showNext}>›</button>
            )}
          </div>
        )}

        {/* 5. YOUTUBE */}
        {method.video_url && method.video_url.trim() !== "" && (
          <div className="method-detail__media-section">
            <h2 className="method-detail__block-title">Видео-обзор методики</h2>
            <div className="method-detail__video-box">
              <iframe 
                src={getYouTubeEmbedUrl(method.video_url)} 
                title={pageTitle} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
