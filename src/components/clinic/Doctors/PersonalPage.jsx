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

  // 1. Кнопка в состоянии загрузки
  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <button className="method-detail__back-btn" onClick={() => navigate('/clinic/doctors')}>
            <span className="method-detail__back-arrow">&larr;</span> Назад к списку
          </button>
        </div>
        <div className="animate-pulse bg-gray-200 h-[400px] w-full rounded-xl" style={{ backgroundColor: '#e5e7eb', height: '400px', borderRadius: '12px' }} />
      </div>
    );
  }

  // 2. Кнопка в состоянии ошибки 404
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
        
        {/* 3. Кнопка в основном контенте страницы */}
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
            <h1 className="doctor-personal__fullname" dangerouslySetInnerHTML={{ __html: doctor.name }} />
            <span className="doctor-personal__badge-exp">{doctor.exp}</span>
            <div className="doctor-personal__divider"></div>
            <div className="doctor-personal__bio">
              <h2 className="doctor-personal__section-title">Биография и достижения</h2>
              <p className="doctor-personal__fullbio-text" style={{ whiteSpace: 'pre-line' }}>
                {doctor.full_bio || doctor.desc}
              </p>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: Фото и кнопка (Будет плавать благодаря CSS position: sticky) */}
          <div className="doctor-personal__photo-block">
            <div className="doctor-personal__avatar-wrapper">
              <img src={displayPhoto} alt={doctor.name} className="doctor-personal__avatar" />
            </div>


            {/*  🛡️ Временно скрываем кнопку *}
            {/*}
            <button className="doctor-personal__cta-btn" onClick={() => alert(`Запись к специалисту: ${doctor.name}`)}>
              Записаться на прием
            </button>
            */}
          </div>
          
        </div>

        {/* Блок видео (ИСПРАВЛЕН синтаксис ссылки YouTube эмбеда) */}
        {doctor.video_url && doctor.video_url.trim() !== "" && (
          <div className="doctor-personal__media-section">
            <h2 className="doctor-personal__block-title">Видео со специалистом</h2>
            <div className="doctor-personal__video-box">
              <iframe 
                src={`https://youtube.com{doctor.video_url}`} 
                title={doctor.name} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <GridMethods methods={doctor.methods} />

      </div>
    </section>
  );
}
