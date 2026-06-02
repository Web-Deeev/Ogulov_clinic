import React from 'react';
import ClinicBanner from '../../components/clinic/Home/ClinicBanner.jsx';
import MethodsSection from '../../components/clinic/Home/MethodSection.jsx';
import HomeInfo from '../../components/clinic/Home/HomeInfo.jsx';
import StaffCard from '../../components/clinic/Home/StaffCard.jsx'; 

export default function ClinicHome() {
  return (
    <div className="clinic-home-page">
      {/* 1. Динамический промо-баннер */}
      <ClinicBanner />
   
      {/* 2. Карусель медицинских методик лечения */}
      <MethodsSection />

      {/* 3. Презентационный инфо-блок Огулова (50 на 50) */}
      <HomeInfo />

      {/* 4. Театральный трехпанельный слайдер врачей */}
      <StaffCard />


    </div>
  );
}
