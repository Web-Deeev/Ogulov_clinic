import React from 'react';
import ClinicBanner from '../../components/clinic/ClinicBanner/ClinicBanner';
import AboutClinic from '../../components/clinic/AboutClinic/AboutClinic';

import './clinic.css';

export default function ClinicAbout() {
  return (
    <div className="clinic-spa-page">

      
      {/* Ссылка "О клинике" (#about) ведет на наш глубокий лонгрид */}
      <div id="about">
        <AboutClinic />
      </div>
      
    </div>
  );
}
