import React from 'react';
import ClinicBanner from '../../components/clinic/Home/ClinicBanner.jsx';
import MethodsSection from '../../components/clinic/Home/MethodSection.jsx';
import DoctorSection from '../../components/clinic/Home/DoctorSection.jsx';



/**
 * Главная страница клиники (Огулов Клиник)
 * Высокий уровень абстракции (KISS / SOLID). 
 * Каждый дочерний компонент сам отвечает за свои данные.
 */
export default function ClinicHome() {
  return (
    <div className="clinic-home-page">
      {/* 1. Динамический промо-баннер */}
      <ClinicBanner />

      {/* 2. Изолированная карусель методик лечения */}
      <MethodsSection />

      {/* 3. Изолированная карусель специалистов */}
      {/*<DoctorsSection />*/}

    </div>
  );
}
