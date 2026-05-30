import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header'; 
import './CardPage.css';
import './MethodCard.css';
import { clinicApi } from '../../../api/clinic/clinic'; 

export default function MethodDetailPage() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    clinicApi.getMethodBySlug(id)
      .then(response => {
        setMethod(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки данных методики:", error);
        setMethod(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="clinic-page-wrapper">
        <Header />
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <h2 style={{ color: '#2c2520' }}>Загрузка описания методики...</h2>
        </div>
      </div>
    );
  }

  if (!method) {
    return (
      <div className="clinic-page-wrapper">
        <Header />
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <h2 style={{ color: '#2c2520', marginBottom: '20px' }}>Методика не найдена</h2>
          <button className="method-detail__back-btn" onClick={() => navigate('/clinic/methods')}>
            Вернуться к списку методик
          </button>
        </div>
      </div>
    );
  }

  const mainPhoto = method.image || 'https://placehold.co';
  const additionalPhotos = method.gallery || [];

  return (
    <div className="clinic-page-wrapper">
      <Header />

      <main className="clinic-main-content">
        <section className="method-detail-page">
          <div className="container">
            
            <button className="method-detail__back-btn" onClick={() => navigate('/clinic/methods')}>
              <span className="method-detail__back-arrow">&larr;</span> Назад к списку методик
            </button>

            {/* 1. СВЕРХУ: Главный широкоформатный фоновый баннер методики */}
            <div className="method-detail__top-hero">
              <img src={mainPhoto} alt={method.title} className="method-detail__hero-img" />
              <div className="method-detail__hero-overlay">
                <span className="method-detail__badge">Методика оздоровления</span>
                <h1 className="method-detail__title">{method.title}</h1>
              </div>
            </div>

            {/* 2. ПО ЦЕНТРУ: Двухколоночный блок (Текст слева 50%, Фото и Кнопка справа 50%) */}
            {/* ИСПРАВЛЕНО: Изменена структура на двухколоночную в стиле официального сайта */}
            <div className="method-detail__two-columns">
              
              {/* ЛЕВАЯ КОЛОНКА (50%): Весь текст сути и показаний */}
              <div className="method-detail__text-column">
                <h2 className="method-detail__section-title">Суть и медицинские показания</h2>
                <p 
                  className="method-detail__fullbio-text" 
                  style={{ whiteSpace: 'pre-line !important' }}
                >
                  {method.full_desc || method.short_desc}
                </p>
              </div>
              
              {/* ПРАВАЯ КОЛОНКА (50%): Персональное фото методики и кнопка записи */}
              <div className="method-detail__visual-column">
                <div className="method-detail__side-photo-wrapper">
                  <img src={mainPhoto} alt={method.title} className="method-detail__side-photo" />
                </div>
                <div className="method-detail__cta-box">
                  <button className="method-detail__cta-btn" onClick={() => alert(`Заявка на консультацию по методике: ${method.title}`)}>
                    Записаться на консультацию
                  </button>
                </div>
              </div>

            </div>

            {/* 3. СНИЗУ ФОТО: Дополнительная Grid-сетка изображений из MethodGalleryInline */}
            {additionalPhotos.length > 0 && (
              <div className="method-detail__gallery-section">
                <h2 className="method-detail__block-title">Процесс проведения практики</h2>
                <div className="method-detail__gallery-grid">
                  {additionalPhotos.map((item, index) => (
                    <div key={`gallery-item-${item.id}`} className="method-detail__gallery-item">
                      <img src={item.image} alt={`${method.title} фото ${index + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. САМЫЙ НИЗ: YouTube видео */}
            {method.video_url && method.video_url.trim() !== "" && (
              <div className="method-detail__media-section">
                <h2 className="method-detail__block-title">Видео-обзор методики</h2>
                <div className="method-detail__video-box">
                  <iframe 
                    src={`https://youtube.com{method.video_url}`} 
                    title={method.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}
