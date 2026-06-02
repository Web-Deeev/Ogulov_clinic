import React from 'react';
<<<<<<< Updated upstream
// import ClinicBanner from '../../components/clinic/ClinicBanner/ClinicBanner';
// import AboutClinic from '../../components/clinic/AboutClinic/AboutClinic';

import Header from '../../components/common/Header/Header'
import ClinicBanner from '../../components/clinic/ClinicBanner/ClinicBanner'
import MethodsSlider from '../../components/clinic/MethodsSlider/MethodsSlider'
import AboutClinic from '../../components/clinic/AboutClinic/AboutClinic'
import Specialists from '../../components/clinic/Specialists/Specialists'
=======
import AboutClinic from '../../components/clinic/AboutClinic/AboutClinic';
>>>>>>> Stashed changes

import './clinic.css';

export default function ClinicAbout() {
  return (
<<<<<<< Updated upstream
    // <div className="clinic-spa-page">
      
    //   {/* Ссылка "Главная" (#hero) ведет на первый экран баннера */}
    //   <div id="hero">
    //     <ClinicBanner />
    //   </div>
      
    //   {/* Ссылка "О клинике" (#about) ведет на наш глубокий лонгрид */}
    //   <div id="about">
    //     <AboutClinic />
    //   </div>
      
    // </div>
    <>
      {/* <Header /> */}
      <ClinicBanner />
      <MethodsSlider />
      <AboutClinic />
      <Specialists />
    </>
=======
    <div className="clinic-spa-page animate-fade-in">
      {/* Оставляем только глубокий лонгрид о клинике и методах */}
      <div id="about">
        <AboutClinic />
      </div>
    </div>
>>>>>>> Stashed changes
  );
}
