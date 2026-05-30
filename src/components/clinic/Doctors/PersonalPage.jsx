import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../common/Header/Header';
import { mockDoctors } from './DoctorsData';
import './PersonalPage.css';

export default function DoctorPersonalPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const doctor = mockDoctors.find(doc => doc.slug === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!doctor) {
    return (
      <div className="clinic-page-wrapper">
        <Header />
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <h2>Специалист не найден</h2>
          <button className="doctor-personal__back" onClick={() => navigate('/clinic/doctors')}>
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  // ОПРЕДЕЛЯЕМ ФОТО: Если у Огулова прописано personalImage, берем его. Если у других нет — берем обычное image.
  const displayPhoto = doctor.personalImage || doctor.image || 'https://placehold.co';

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
                <span className="doctor-personal__badge-role">{doctor.role}</span>
                <h1 className="doctor-personal__fullname" dangerouslySetInnerHTML={{ __html: doctor.name }} />
                <span className="doctor-personal__badge-exp">{doctor.exp}</span>
                <div className="doctor-personal__divider"></div>
                <div className="doctor-personal__bio">
                  <h2 className="doctor-personal__section-title">Биография и достижения</h2>
                  <p className="doctor-personal__fullbio-text">{doctor.fullBio || doctor.desc}</p>
                </div>
              </div>

              {/* ПРАВЫЙ БЛОК: Сюда встает именно персональное статичное фото */}
              <div className="doctor-personal__photo-block">
                <div className="doctor-personal__avatar-wrapper">
                  <img src={displayPhoto} alt={doctor.name} className="doctor-personal__avatar" />
                </div>
                <button className="doctor-personal__cta-btn">Записаться на прием</button>
              </div>

            </div>

            {/* Видео-блок и методы остаются ниже без изменений */}
            {doctor.videoUrl && doctor.videoUrl.trim() !== "" && (
              <div className="doctor-personal__media-section">
                <h2 className="doctor-personal__block-title">Видео со специалистом</h2>
                <div className="doctor-personal__video-box">
                  <iframe 
                    src={`https://youtube.com{doctor.videoUrl}`} 
                    title={doctor.name} 
                    frameBorder="0" 
                    allowFullScreen
                  ></iframe>
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
