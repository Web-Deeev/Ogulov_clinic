import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clinicApi } from '../../../api/clinic/clinic'; 
import './CardPage.css';
import './MethodCard.css';

export default function MethodDetailPage() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // DRY: window.scrollTo(0, 0) удален, так как у нас теперь работает глобальный ScrollToTop
    setLoading(true);

    clinicApi.getMethodBySlug(id)
      .then(response => {
        setMethod(response.data);
      })
      .catch(error => {
        console.error("Ошибка загрузки данных методики:", error);
        setMethod(null);
      })
      .finally(() => setLoading(false)); // Наш стандарт: закрываем лоадер в любом случае
  }, [id]);

  // 1. Состояние загрузки (SOLID: без Header, оберток и лишней верстки)
  if (loading) {
    return (
      <div className="container animate-pulse-eff" style={{ padding: '100px 0', textAlign: 'center' }}>
        <div style={{ height: '40px', width: '250px', backgroundColor: '#e5e7eb', margin: '0 auto 30px auto', borderRadius: '6px' }} />
        <div style={{ height: '350px', width: '100%', backgroundColor: '#e5e7eb', borderRadius: '12px' }} />
      </div>
    );
  }

  // 2. Обработка ошибки 404 (KISS: только чистый контент сообщения)
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

  const mainPhoto = method.image || 'https://placehold.co';
  const additionalPhotos = method.gallery || [];

  return (
    // Оставляем только семантическую секцию. Каркас clinic-page-wrapper, Header и main уже в ClinicLayout!
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

        {/* 2. ПО ЦЕНТРУ: Двухколоночный блок */}
        <div className="method-detail__two-columns">
          
          {/* ЛЕВАЯ КОЛОНКА (50%): Текст */}
          <div className="method-detail__text-column">
            <h2 className="method-detail__section-title">Суть и медицинские показания</h2>
            <p className="method-detail__fullbio-text" style={{ whiteSpace: 'pre-line' }}>
              {method.full_desc || method.short_desc}
            </p>
          </div>
          
          {/* ПРАВАЯ КОЛОНКА (50%): Фото методики и кнопка записи */}
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

        {/* 3. СНИЗУ ФОТО: Дополнительная Grid-сетка изображений */}
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

        {/* 4. САМЫЙ НИЗ: YouTube видео (ИСПРАВЛЕН битый URL эмбеда) */}
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
  );
}
