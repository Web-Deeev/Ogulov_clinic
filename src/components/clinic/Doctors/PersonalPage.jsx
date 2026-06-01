import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clinicApi } from '../../../api/clinic/clinic'; 
import Slider from '../ui/Slider.jsx'; 
import MethodCard from '../Methods/MethodCard.jsx'; 
import BookingModal from '../ui/BookingModal.jsx'; // ИСПРАВЛЕНО: Добавлен импорт модалки

import './PersonalPage.css';
import '../Methods/CardPage.css'; 

export default function DoctorPersonalPage() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false); // ИСПРАВЛЕНО: Стейт формы записи

  useEffect(() => {
    let isCurrentRequest = true; // Защита от Race Condition
    setLoading(true);

    clinicApi.getDoctorBySlug(id)
      .then(response => {
        if (isCurrentRequest) {
          setDoctor(response.data);
        }
      })
      .catch(error => {
        console.error("Ошибка загрузки профиля врача:", error);
        if (isCurrentRequest) {
          setDoctor(null);
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setLoading(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [id]);

  // JS-предохранитель для парсинга YouTube ссылок (ИСПРАВЛЕНО: добавлены $ и /embed/)
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    
    const trimmedUrl = url.trim();

    if (!trimmedUrl.includes('http') && !trimmedUrl.includes('youtube') && !trimmedUrl.includes('youtu.be')) {
      return `https://youtube.com{trimmedUrl}`;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = trimmedUrl.match(regExp);
    
    if (match && match[2] && match[2].length === 11) {
      return `https://youtube.com{match[2]}`;
    }
    
    return trimmedUrl;
  };

  // 1. Состояние загрузки
  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <button type="button" className="method-detail__back-btn" onClick={() => navigate('/clinic/doctors')}>
            <span className="method-detail__back-arrow">&larr;</span> Назад к списку
          </button>
        </div>
        <div className="animate-pulse" style={{ backgroundColor: '#e5e7eb', height: '400px', borderRadius: '12px' }} />
      </div>
    );
  }

  // 2. Состояние ошибки 404
  if (!doctor) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#2c2520', marginBottom: '20px' }}>Специалист не найден</h2>
        <button type="button" className="method-detail__back-btn" onClick={() => navigate('/clinic/doctors')}>
          <span className="method-detail__back-arrow">&larr;</span> Вернуться к списку
        </button>
      </div>
    );
  }

  // Вычисляемые свойства
  const hasGalleryPhotos = doctor.gallery && doctor.gallery.length > 0;
  const displayPhoto = hasGalleryPhotos ? doctor.gallery[0].image : (doctor.image || '');
  const hasMethods = doctor.methods && doctor.methods.length > 0;
  const embedVideoUrl = getYouTubeEmbedUrl(doctor.video_url);
  return (
    <section className="doctor-personal-page">
      <div className="container">
        
        {/* 3. Кнопка возврата в основном контенте страницы */}
        <button 
          type="button"
          className="method-detail__back-btn" 
          onClick={() => navigate('/clinic/doctors')}
        >
          <span className="method-detail__back-arrow" aria-hidden="true">&larr;</span> Назад к списку специалистов
        </button>

        {/* Контейнер двух колонок: левая растет, правая — плавает (sticky) */}
        <div className="doctor-personal__main-card">
          
          {/* ЛЕВАЯ КОЛОНКА: Биография */}
          <article className="doctor-personal__info-block">
            <span className="doctor-personal__badge-role">
              {doctor.role || 'Специалист центра'}
            </span>
            
            <h1 className="doctor-personal__fullname">
              {doctor.name || 'Специалист центра'}
            </h1>

            {doctor.exp && <span className="doctor-personal__badge-exp">{doctor.exp}</span>}
            <div className="doctor-personal__divider" aria-hidden="true"></div>
            
            <div className="doctor-personal__bio">
              <h2 className="doctor-personal__section-title">Биография и достижения</h2>
              <p className="doctor-personal__fullbio-text" style={{ whiteSpace: 'pre-line' }}>
                {doctor.full_bio || doctor.desc || 'Информация обновляется...'}
              </p>
            </div>
          </article>

          {/* ПРАВАЯ КОЛОНКА: Фото + Кнопка Записи (Как в методике) */}
          <aside className="doctor-personal__photo-block">
            {displayPhoto && (
              <div className="doctor-personal__avatar-wrapper">
                <img 
                  src={displayPhoto} 
                  alt={doctor.name || 'Доктор'} 
                  className="doctor-personal__avatar" 
                  loading="eager" 
                />
              </div>
            )}
            
            {/* ИСПРАВЛЕНО: Кнопка добавлена строго под фото в колонку aside */}
            <div className="doctor-personal__cta-box" style={{ marginTop: '20px' }}>
              <button 
                type="button" 
                className="doctor-personal__cta-btn" 
                onClick={() => setIsBookingOpen(true)}
              >
                Записаться на прием
              </button>
            </div>
          </aside>
          
        </div>

        {/* УСЛОВНЫЙ РЕНДЕРИНГ: Блок видео отображается только при наличии валидного URL */}
        {embedVideoUrl && (
          <section className="doctor-personal__media-section" aria-label="Видео презентация">
            <h2 className="doctor-personal__block-title">Видео со специалистом</h2>
            <div className="doctor-personal__video-box">
              <iframe 
                src={embedVideoUrl} 
                title={`Видео презентация: ${doctor.name || 'Специалист'}`} 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin"
              ></iframe>
            </div>
          </section>
        )}

        {/* ИСПРАВЛЕНО / DRY: Чистый вызов универсального бесконечного слайдера */}
        {hasMethods && (
          <Slider 
            items={doctor.methods}
            title="Практикуемые методики лечения"
            scrollStep={340}
            renderItem={(method) => <MethodCard method={method} />}
          />
        )}

        {/* ========================================================================= */}
        {/* ВСТРАИВАЕМ МОДАЛЬНОЕ ОКНО ФОРМЫ (АДАПТИРОВАНО ПОД КЫРГЫЗСТАН)             */}
        {/* ========================================================================= */}
        <BookingModal 
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          targetName={doctor.name || 'Специалист центра'}
          targetId={doctor.id}
          apiEndpoint={clinicApi.createLead}
        />

      </div>
    </section>
  );
}
