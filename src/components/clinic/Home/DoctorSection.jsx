import React, { useEffect, useState } from 'react';
import Slider from '../../clinic/ui/Slider.jsx'; 
import DoctorSection from './DoctorSection.jsx'; // 🟢 Используем твой оригинальный рабочий компонент
import { clinicApi } from '@/api/clinic/clinic';
import './DoctorsSection.css';

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    clinicApi.getDoctors()
      .then((response) => {
        if (!isMounted) return;

        // Приводим ответ к массиву независимо от наличия пагинации на бэке
        const result = response?.data ? response.data : response;
        const dataArray = result?.results ? result.results : result;

        if (Array.isArray(dataArray)) {
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
    <div className="container doctors-slider-container">
      <Slider 
        items={doctors}
        title="Наши специалисты"
        scrollStep={564} 
        viewAllLink="/doctors" 
        viewAllText="Смотреть всех специалистов"
        renderItem={(doctor, index) => (
          // 🎯 ФИКС: Рендерим оригинальный DoctorSection, в котором логика переходов уже отлажена
          <DoctorSection 
            key={doctor?.id || doctor?.slug || `doc-${index}`} 
            doctor={doctor} 
          />
        )}
      />
    </div>
  );
}