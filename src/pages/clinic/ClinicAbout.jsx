import React from 'react';
import ClinicBanner from '../../components/clinic/ClinicBanner/ClinicBanner';
import MethodsSlider from '../../components/clinic/MethodsSlider/MethodsSlider';
import AboutClinic from '../../components/clinic/AboutClinic/AboutClinic';

import './clinic.css';

export default function ClinicAbout() {
  return (
    <div className="clinic-spa-page">
     
      
      {/* Ссылка "Главная" (#hero) ведет сюда */}
      <div id="hero">
        <ClinicBanner />
      </div>
      
      {/* Ссылка "О клинике" (#about) ведет сюда */}
      <div id="about">
        <AboutClinic />
      </div>
      
      {/* Если здесь нужен слайдер методик, можешь раскомментировать: */}
      {/* <MethodsSlider /> */}
    </div>
  );
}
