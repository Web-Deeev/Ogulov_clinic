import React, { useState, useEffect } from 'react';
import { clinicApi } from '@/api/clinic/clinic'; // Твой официальный слой API-запросов
import AwardTabs from '../../components/clinic/Awards/Tabs.jsx';
import AwardCard from '../../components/clinic/Awards/Card.jsx';
import AwardSkeleton from '../../components/clinic/Awards/Skeleton.jsx';

// 🔥 ИСПРАВЛЕНО: Ровный, точный относительный путь без тройных точек
import Lightbox from '../../components/clinic/ui/Lightbox.jsx';

import '../../components/clinic/Awards/Awards.css';

export default function ClinicAwards() {
  const [awards, setAwards] = useState([]);
  const [activeTab, setActiveTab] = useState('diploma'); // 'diploma' или 'certificate'
  const [loading, setLoading] = useState(true);

  // СОСТОЯНИЕ ДЛЯ НАШЕГО ИНТЕГРИРОВАННОГО ЛАЙТБОКСА
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    clinicApi.getAwards()
      .then(response => {
        const awardsList = Array.isArray(response.data) 
          ? response.data 
          : (response.data.results || []);
        setAwards(awardsList);
      })
      .catch(error => {
        console.error("Ошибка API наград, активирован локальный фолбэк:", error);
        // Переведено на сертификаты в соответствии с ТЗ для фолбэка
        setAwards([
          { id: 1, title: "Диплом профессора народной медицины А.Т. Огулова", award_type: "diploma", image: "/images/diploma-fallback.jpg" },
          { id: 2, title: "Сертификат Академии", award_type: "certificate", image: "/images/gratitude-fallback.jpg" }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Переключаем табы и сбрасываем открытую модалку во избежание багов индекса
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveImageIndex(null);
  };

  // Фильтруем документы под текущий выбранный таб (diploma или certificate)
  const filteredAwards = awards.filter(award => award.award_type === activeTab);

  // Функции перелистывания слайдов, полностью сохраняющие логику твоих методик
  const showPrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? filteredAwards.length - 1 : prev - 1));
  };

  const showNext = () => {
    setActiveImageIndex((prev) => (prev === filteredAwards.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="clinic-awards">
      <div className="container">
        
        <header className="clinic-awards__header">
          <h1 className="clinic-awards__title">Награды центра</h1>
          <p className="clinic-awards__subtitle">Признание профессионального сообщества, дипломы и сертификаты Академии</p>
        </header>

        {/* Управляющие вкладки */}
        <AwardTabs activeTab={activeTab} onChangeTab={handleTabChange} />

        {/* Сетка документов */}
        <div className="clinic-awards__grid">
          {loading ? (
            // Рендерим 4 независимых скелетона без синтаксических сокращений
            [1, 2, 3, 4].map(n => <AwardSkeleton key={n} />)
          ) : filteredAwards.length > 0 ? (
            // Рендерим чистые карточки наград и передаем индекс для открытия модалки
            filteredAwards.map((award, index) => (
              <AwardCard 
                key={award.id} 
                award={award} 
                onOpenLightbox={() => setActiveImageIndex(index)} 
              />
            ))
          ) : (
            <div className="clinic-awards__empty">В данной категории документы обновляются...</div>
          )}
        </div>

        {/* ========================================================================== */}
        {/* 🔥 ИНТЕГРИРОВАННЫЙ УНИВЕРСАЛЬНЫЙ ЛАЙТБОКС ИЗ ПАПКИ UI                       */}
        {/* ========================================================================== */}
        <Lightbox 
          photos={filteredAwards}
          activeIndex={activeImageIndex}
          onClose={() => setActiveImageIndex(null)}
          onPrev={showPrev}
          onNext={showNext}
        />

      </div>
    </section>
  );
}
