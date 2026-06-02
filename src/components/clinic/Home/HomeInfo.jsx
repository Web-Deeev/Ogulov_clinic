import React, { useEffect, useState } from 'react';
import { clinicApi } from '../../../api/clinic/clinic'; 
import Lightbox from '../ui/Lightbox.jsx'; 
import './HomeInfo.css';

export default function AboutClinic() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Управление твоим системным Lightbox со слайдером
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  useEffect(() => {
    clinicApi.getClinicAbout() 
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки данных клиники:', err);
        setError('Не удалось загрузить информацию о клинике');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container" style={{ padding: '40px 0' }}>Загрузка...</div>;
  if (error || !data) return null; 

  const defaultFounderPhoto = '/images/ogulov.jpg';
  const defaultVideoPreview = '/images/about-main.jpg';
  
  const mainVideoPreviewUrl = data.video_preview || defaultVideoPreview;

  // 🎯 ФИКС: Вырезаем первый элемент по его индексу в массиве
  const additionalPhotos = data.gallery_images
    ? data.gallery_images.filter((_, index) => index !== 0)
    : [];

  // Функции переключения для слайдера внутри твоего Lightbox
  const showPrev = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex === 0 ? additionalPhotos.length - 1 : prevIndex - 1
    );
  };

  const showNext = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex === additionalPhotos.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="about-clinic">
      <div className="container">
        <div className="about-clinic__grid">
          
          {/* ТЕКСТОВЫЙ КОНТЕНТ (ЛЕВАЯ КОЛОНКА) */}
          <div className="about-clinic__content">
            <h2>{data.title}</h2>
            <p>{data.description}</p>

            <div className="about-clinic__doctor">
              <img
                src={data.founder_photo || defaultFounderPhoto}
                alt={data.founder_name}
              />
              <h3>{data.founder_name}</h3>
              <p>{data.founder_description}</p>
            </div>

            <a href="/about" className="about-clinic__link">
              Подробнее о клинике →
            </a>
          </div>

          {/* ГАЛЕРЕЯ И ВИДЕО (ПРАВАЯ КОЛОНКА) */}
          <div className="about-clinic__gallery">
            
            {/* БОЛЬШОЕ ГЛАВНОЕ ФОТО (ВИДЕО) */}
            <div
              className="about-clinic__video"
              onClick={() => window.open(data.video_url, '_blank')}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={mainVideoPreviewUrl} 
                alt={data.title} 
              />
              <div className="about-clinic__video-overlay">
                <div className="about-clinic__play">▶</div>
                <span>
                  Посмотрите видео
                  <br />
                  об Огулов Центре
                </span>
              </div>
            </div>

            {/* НИЖНИЕ ФОТО — Теперь здесь гарантированно 4 штуки без первого дубля */}
            <div className="about-clinic__photos">
              {additionalPhotos.map((item, index) => (
                <img 
                  key={item.id} 
                  src={item.image} 
                  alt={item.alt_text || "Фото клиники"} 
                  onClick={() => setActiveImageIndex(index)} 
                  style={{ cursor: 'pointer' }}
                  className="gallery-thumb"
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ТВОЙ СИСТЕМНЫЙ КОМПОНЕНТ LIGHTBOX СО СЛАЙДЕРОМ */}
      <Lightbox 
        photos={additionalPhotos}
        activeIndex={activeImageIndex}
        onClose={() => setActiveImageIndex(null)}
        onPrev={showPrev}
        onNext={showNext}
      />
    </section>
  );
}
