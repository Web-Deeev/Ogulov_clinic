import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Подключаем хуки роутера
import Header from '../../common/Header/Header'; // Личной странице тоже нужна шапка!
import { mockDoctors } from './DoctorsData';
import './PersonalPage.css';

export default function DoctorPersonalPage() {
  const { id } = useParams(); // Получаем ID из URL (например, "1")
  const navigate = useNavigate(); // Инструмент для программного шага назад

  // Находим данные доктора по ID, приведенному к числу
  const doctor = mockDoctors.find(doc => doc.slug === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Защита: если пациент вбил в ручную кривой ID (например, /clinic/doctors/999)
  if (!doctor) {
    return (
      <div className="clinic-page-wrapper">
        <Header />
        <div className="container" style={{ padding: '100px 0', textIn: 'center' }}>
          <h2>Специалист не найден</h2>
          <button className="doctor-personal__back" onClick={() => navigate('/clinic/doctors')}>
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="clinic-page-wrapper">
      {/* Шапка зафиксирована сверху на личной странице */}
      <Header />

      <main className="clinic-main-content">
        <section className="doctor-personal-page">
          <div className="container">
            
            {/* Кнопка "Назад" теперь красиво возвращает по истории роутера */}
            <button className="doctor-personal__back" onClick={() => navigate('/clinic/doctors')}>
              <span className="doctor-personal__back-arrow">&larr;</span> Назад к списку специалистов
            </button>

            <div className="doctor-personal__main-card">
              <div className="doctor-personal__photo-block">
                <div className="doctor-personal__avatar-wrapper">
                  <img src={doctor.image} alt={doctor.name} className="doctor-personal__avatar" />
                </div>
                <button className="doctor-personal__cta-btn">Записаться на прием</button>
              </div>

              <div className="doctor-personal__info-block">
                <span className="doctor-personal__badge-role">{doctor.role}</span>
                <h1 className="doctor-personal__fullname">{doctor.name}</h1>
                <span className="doctor-personal__badge-exp">{doctor.exp}</span>
                <div className="doctor-personal__divider"></div>
                <div className="doctor-personal__bio">
                  <h2 className="doctor-personal__section-title">Биография и достижения</h2>
                  <p className="doctor-personal__fullbio-text">{doctor.fullBio || doctor.desc}</p>
                </div>
              </div>
            </div>

            {doctor.videoUrl && (
              <div className="doctor-personal__media-section">
                <h2 className="doctor-personal__block-title">Video со специалистом</h2>
                <div className="doctor-personal__video-box">
                  <iframe src={`https://youtube.com{doctor.videoUrl}`} title={doctor.name} frameBorder="0" allowFullScreen></iframe>
                </div>
              </div>
            )}

            {doctor.methods && doctor.methods.length > 0 && (
              <div className="doctor-personal__methods-section">
                <h2 className="doctor-personal__block-title">Практикуемые методики лечения</h2>
                <div className="doctor-personal__methods-grid">
                  {doctor.methods.map((method) => (
                    <div key={method.id} className="doctor-personal__method-card" onClick={() => navigate(`/clinic/methods#${method.id}`)}>
                      <div className="doctor-personal__method-icon">✦</div>
                      <div className="doctor-personal__method-content">
                        <h3>{method.title}</h3>
                        <p>{method.shortDesc}</p>
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
