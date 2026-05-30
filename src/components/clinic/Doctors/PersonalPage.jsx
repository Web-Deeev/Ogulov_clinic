import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../common/Header/Header'; 
import './PersonalPage.css';

// ИСПРАВЛЕНО: Убрали голый axios. Оставляем только твой готовый модуль запросов клиники
import { clinicApi } from '../../../api/clinic/clinic'; 

export default function DoctorPersonalPage() {
  // Извлекаем id (это наш уникальный ЧПУ-слаг, например: "kolbina-tatyana-vladimirovna")
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    // ИСПРАВЛЕНО: Вызываем чистую и пуленепробиваемую функцию из твоего файла запросов
    clinicApi.getDoctorBySlug(id)
      .then(response => {
        // Axios автоматически парсит JSON в поле .data
        setDoctor(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки профиля врача через clinicApi:", error);
        setDoctor(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="clinic-page-wrapper">
        <Header />
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <h2>Загрузка профиля специалиста...</h2>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="clinic-page-wrapper">
        <Header />
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <h2 style={{ color: '#2c2520', marginBottom: '20px' }}>Специалист не найден</h2>
          <button className="doctor-personal__back" onClick={() => navigate('/clinic/doctors')}>
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const displayPhoto = doctor.image || 'https://placehold.co';

  return (
    <div className="clinic-page-wrapper">
      <Header />

      <main className="clinic-main-content">
        <section className="doctor-personal-page">
          <div className="container">
            
            <button className="doctor-personal__back" onClick={() => navigate('/clinic/doctors')}>
              <span className="doctor-personal__back-arrow">&larr;</span> Назад к списку специалистов
            </button>

            <div className="doctor-personal__main-card">
              
              {/* ЛЕВЫЙ БЛОК: Текст, регалии и биография */}
              <div className="doctor-personal__info-block">
                <span className="doctor-personal__badge-role">
                  {doctor.role ? doctor.role : 'Специалист центра'}
                </span>
                <h1 className="doctor-personal__fullname" dangerouslySetInnerHTML={{ __html: doctor.name }} />
                <span className="doctor-personal__badge-exp">{doctor.exp}</span>
                <div className="doctor-personal__divider"></div>
                <div className="doctor-personal__bio">
                  <h2 className="doctor-personal__section-title">Биография и достижения</h2>
                  <p className="doctor-personal__fullbio-text" style={{ whiteSpace: 'pre-line !important' }}>
                    {doctor.full_bio || doctor.desc}
                  </p>
                </div>
              </div>

              {/* ПРАВЫЙ БЛОК: Персональное фото из медиа бэкенда */}
              <div className="doctor-personal__photo-block">
                <div className="doctor-personal__avatar-wrapper">
                  <img src={displayPhoto} alt={doctor.name} className="doctor-personal__avatar" />
                </div>
                <button className="doctor-personal__cta-btn" onClick={() => alert(`Запись к специалисту: ${doctor.name}`)}>
                  Записаться на прием
                </button>
              </div>

            </div>

            {/* Видео со специалистом */}
            {doctor.video_url && doctor.video_url.trim() !== "" && (
              <div className="doctor-personal__media-section">
                <h2 className="doctor-personal__block-title">Видео со специалистом</h2>
                <div className="doctor-personal__video-box">
                  {/* ИСПРАВЛЕНО: Синтаксис роута встраивания плеера YouTube */}
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

            {/* Практикуемые методики */}
            {doctor.methods && doctor.methods.length > 0 && (
              <div className="doctor-personal__methods-section">
                <h2 className="doctor-personal__block-title">Практикуемые методики лечения</h2>
                <div className="doctor-personal__methods-grid">
                  {doctor.methods.map((method) => (
                    <div 
                      key={method.id} 
                      className="doctor-personal__method-card" 
                      onClick={() => navigate(`/clinic/methods/${method.slug}`)}
                    >
                      <div className="doctor-personal__method-icon">✦</div>
                      <div className="doctor-personal__method-content">
                        <h3>{method.title}</h3>
                        <p>{method.short_desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}
