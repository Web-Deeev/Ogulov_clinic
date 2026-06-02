import React, { useEffect, useState } from 'react';
import Slider from '../../clinic/ui/Slider.jsx'; // 🟢 Импортируем твой универсальный слайдер!
import DoctorSection from './DoctorSection.jsx'; // Наша новая горизонтальная карточка
import { clinicApi } from '@/api/clinic/clinic';

/**
 * Изолированная секция специалистов для главной страницы.
 * SOLID/DRY: Повторно использует абстрактный Slider и рендерит мини-баннеры.
 */
export default function DoctorsSection() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    clinicApi.getDoctors()
      .then((response) => {
        if (!isMounted) return;

        const result = response?.data ? response.data : response;
        const dataArray = result?.results ? result.results : result;

        if (Array.isArray(dataArray)) {
          // Пропускаем только полноценные объекты с заполненным именем
          const validDoctors = dataArray.filter(doc => doc && (doc.name || doc.full_name));
          setDoctors(validDoctors);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('❌ Ошибка загрузки специалистов из Django:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  if (isLoading || doctors.length === 0) return null;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      {/* 
        🎯 ПОЛНОЕ СОЕДИНЕНИЕ (KISS):
        Прокидываем массив из Django и через Render Props отрисовываем мини-баннеры.
        scrollStep выставлен на 564px (под ширину горизонтальной карточки 540px + отступ).
      */}
      <Slider 
        items={doctors}
        title="Наши специалисты"
        scrollStep={564} 
        viewAllLink="/doctors" 
        viewAllText="Смотреть всех специалистов"
        renderItem={(doctor, index) => (
          <DoctorHomeCard key={doctor?.id || doctor?.slug || `mini-${index}`} doctor={doctor} />
        )}
      />
    </div>
  );
}
