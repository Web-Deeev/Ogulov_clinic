import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Добавили Navigate для редиректа

// Спускаемся в подпапку clinic
import ClinicLayout from './clinic/ClinicLayout';
import ClinicAbout from './clinic/ClinicAbout';
import ClinicDoctors from './clinic/ClinicDoctors';
import ClinicMethods from './clinic/ClinicMethods';
import ClinicAwards from './clinic/ClinicAwards';
import ClinicFAQ from './clinic/ClinicFAQ';
import ClinicContacts from './clinic/ClinicContacts';
import ClinicHome from './clinic/ClinicHome';

// Поднимаемся на уровень выше и идем в components
import PersonalPage from '../components/clinic/Doctors/PersonalPage';
import MethodCardPage from '../components/clinic/Methods/CardPage';

export default function RouterClinic() {
  return (
    <Routes>
      {/* 🎯 РЕДИРЕКТ С КОРНЯ: если пользователь зашел просто на сайт, 
          автоматически перекидываем его на /clinic */}
      <Route path="/" element={<Navigate to="/clinic" replace />} />

      <Route element={<ClinicLayout />}>
        
        {/* Главная страница клиники (откроется по адресу /clinic) */}
        <Route path="clinic" element={<ClinicHome />} />
        
        {/* 🎯 СИНХРОНИЗАЦИЯ С ШАПКОЙ (Фикс белого экрана): символ в символ */}
        <Route path="clinic/about" element={<ClinicAbout />} />
        <Route path="clinic/doctors" element={<ClinicDoctors />} />
        <Route path="clinic/doctors/:id" element={<PersonalPage />} />
        <Route path="clinic/methods" element={<ClinicMethods />} />
        <Route path="clinic/methods/:id" element={<MethodCardPage />} />
        <Route path="clinic/awards" element={<ClinicAwards />} />
        <Route path="clinic/faq" element={<ClinicFAQ />} />
        <Route path="clinic/contacts" element={<ClinicContacts />} />
        
      </Route>
    </Routes>
  );
}
