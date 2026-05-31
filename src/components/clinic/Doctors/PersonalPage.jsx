import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clinicApi } from '../../../api/clinic/clinic'; 
import GridMethods from './GridMethods.jsx';

import './PersonalPage.css';
import '../Methods/CardPage.css'; 

export default function DoctorPersonalPage() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // DRY: Автоматический скролл наверх теперь под контролем хука ScrollToTop
    setLoading(true);

    clinicApi.getDoctorBySlug(id)
      .then(response => {
        setDoctor(response.data);
      })
      .catch(error => {
        console.error("Ошибка загрузки профиля врача:", error);
        setDoctor(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // JS-предохранитель для парсинга YouTube ссылок (KISS / Defensive Design)
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    // Если в базе лежит только ID (например, "dQw4w9WgXcQ")
    if (!url.includes('http') && !url.includes('youtube')) {
      return `https://youtube.com{url.trim()}`;
    }
    // Если пришла полная ссылка, вырезаем ID через регулярку
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://youtube.com{match[2]}`;
    }
    return url; // Фолбэк, если ссылка уже идеально сформирована бэкендом
  };

  // 1. Состояние загрузки
  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <button className="method-detail__back-btn" onClick={() => navigate('/clinic/doctors')}>
            <span className="method-detail__back-arrow">&larr;</span> Назад к списку
          </button>
        </div>
        <div className="animate-pulse" style={{ backgroundColor: '#e5e7eb', height: '400px', borderRadius: '12px' }} />
      </div>
    );
  }

  // 2. Состояние ошибки 404 (Специалист не найден)
  if (!doctor) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#2c2520', marginBottom: '20px' }}>Специалист не найден</h2>
        <button className="method-detail__back-btn" onClick={() => navigate('/clinic/doctors')}>
          <span className="method-detail__back-arrow">&larr;</span> Вернуться к списку
        </button>
      </div>
    );
  }

  const displayPhoto = doctor.image || 'https://placehold.co';

  return (
    <section className="doctor-personal-page">
      <div className="container">
        
        {/* 3. Кнопка возврата в основном контенте страницы */}
        <button className="method-detail__back-btn" onClick={() => navigate('/clinic/doctors')}>
          <span className="method-detail__back-arrow">&larr;</span> Назад к списку специалистов
        </button>

        {/* Контейнер двух колонок: левая растет, правая — плавает (sticky) */}
        <div className="doctor-personal__main-card">
          
          {/* ЛЕВАЯ КОЛОНКА: Биография */}
          <div className="doctor-personal__info-block">
            <span className="doctor-personal__badge-role">
              {doctor.role ? doctor.role : 'Специалист центра'}
            </span>
            <h1 className="doctor-personal__fullname" dangerouslySetInnerHTML={{ __html: doctor.name || 'Специалист центра' }} />
            {doctor.exp && <span className="doctor-personal__badge-exp">{doctor.exp}</span>}
            <div className="doctor-personal__divider"></div>
            
            <div className="doctor-personal__bio">
              <h2 className="doctor-personal__section-title">Биография и достижения</h2>
              <p className="doctor-personal__fullbio-text" style={{ whiteSpace: 'pre-line' }}>
                {doctor.full_bio || doctor.desc || 'Информация обновляется...'}
              </p>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: Фото (Будет плавать благодаря CSS position: sticky) */}
          <div className="doctor-personal__photo-block">
            <div className="doctor-personal__avatar-wrapper">
              <img src={displayPhoto} alt={doctor.name} className="doctor-personal__avatar" />
            </div>

            {/* ИСПРАВЛЕНО: Безопасный JSX-комментарий, сборка Vite больше не упадет */}
            {/* 
            <button className="doctor-personal__cta-btn" onClick={() => alert(`Запись к специалисту: ${doctor.name}`)}>
              Записаться на прием
            </button>
            */}
          </div>
          
        </div>

        {/* Блок видео (ИСПРАВЛЕН синтаксис шаблона строки и добавлен эмбед-парсер) */}
        {doctor.video_url && doctor.video_url.trim() !== "" && (
          <div className="doctor-personal__media-section">
            <h2 className="doctor-personal__block-title">Видео со специалистом</h2>
            <div className="doctor-personal__video-box">
              <iframe 
                src={getYouTubeEmbedUrl(doctor.video_url)} 
                title={doctor.name} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Наш интерактивный слайдер со стрелками принимает массив методик */}
        <GridMethods methods={doctor.methods} />

      </div>
    </section>
  );
}
