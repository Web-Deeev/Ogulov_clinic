import React, { useState, useEffect } from 'react';
import { clinicApi } from '../../../api/clinic/clinic';
import AboutIntro from './AboutIntro.jsx';
import AboutMedia from './AboutMedia.jsx'; // Очищенный слайдер галереи
import DoctorCard from '../Doctors/DoctorCard.jsx';

export default function AboutLayout() {
  const [gallery, setGallery] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [ogulovData, setOgulovData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ссылка на презентационный ролик клиники Огулова
  const videoUrl = "https://youtube.com"; 

  useEffect(() => {
    let isMounted = true;

    // Параллельно собираем все готовые данные с твоего бэкенда Django
    Promise.all([
      clinicApi.getClinicInfo?.() || Promise.resolve({ data: { title: "О клинике" } }),
      clinicApi.getClinicGallery?.() || Promise.resolve({ data: [] }),
      clinicApi.getDoctors({ is_founder: true, search: 'Огулов' })
    ])
      .then(([infoRes, galleryRes, doctorsRes]) => {
        if (!isMounted) return;
        
        setAboutData(infoRes?.data || infoRes);
        
        const galleryData = galleryRes?.data?.results || galleryRes?.data || galleryRes;
        setGallery(Array.isArray(galleryData) ? galleryData : []);
        
        const docsArray = doctorsRes?.data?.results || doctorsRes?.data || doctorsRes;
        if (Array.isArray(docsArray) && docsArray.length > 0) {
          const founder = docsArray.find(doc => 
            doc?.role?.toLowerCase().includes('основатель') || doc?.name?.includes('Огулов')
          );
          setOgulovData(founder || docsArray[0]);
        }
      })
      .catch((err) => console.error('❌ Ошибка загрузки данных из Django:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return <div className="clinic-about-loading">Загрузка информации о клинике...</div>;
  }

  // Берем первую фотографию из пришедшей с бэка галереи для правого блока 50/50
  const mainPhotoPath = gallery.length > 0 ? gallery[0].image : '/images/about-main.jpg';

  return (
    <div className="about-layout-container">
      
      {/* 
        БЛОК 1: Верхняя секция 50/50. 
        Передаем videoUrl, чтобы правое фото стало кликабельным видео-баннером! 
      */}
      <AboutIntro 
        data={aboutData} 
        mainPhoto={mainPhotoPath}
        videoUrl={videoUrl}
        onMainPhotoClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
      />

      {/* БЛОК 2: Отдельная независимая секция ПОД описанием (Слайдер со 2-й фотки) */}
      {gallery.length > 1 && (
        <div className="about-sections-divider" style={{ marginTop: '60px', padding: '0 20px' }}>
          <AboutMedia gallery={gallery} />
        </div>
      )}

      {/* БЛОК 3: Премиальный баннер Огулова в самом низу страницы под слайдером */}
      {ogulovData && (
        <div className="about-official__promo-banner-layer" style={{ marginTop: '60px', width: '100%', padding: '0 20px' }}>
          <DoctorCard doctor={ogulovData} isFullWidth={true} />
        </div>
      )}

    </div>
  );
}
