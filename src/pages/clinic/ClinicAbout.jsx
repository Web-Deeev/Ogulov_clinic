import React from 'react';
import AboutLayout from '../../components/clinic/AboutClinic/AboutLayout.jsx';
import './clinic.css'; 

export default function ClinicAbout() {
  return (
    <div className="clinic-about-page-wrapper">
      {/* Умный контейнер управляет всей логикой и данными */}
      <AboutLayout />
    </div>
  );
}
