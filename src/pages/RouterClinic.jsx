import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Спускаемся в подпапку clinic
import ClinicLayout from './clinic/ClinicLayout';
import ClinicAbout from './clinic/ClinicAbout';
import ClinicDoctors from './clinic/ClinicDoctors';
import ClinicMethods from './clinic/ClinicMethods';
import ClinicPrices from './clinic/ClinicPrices';
import ClinicAwards from './clinic/ClinicAwards';
import ClinicFAQ from './clinic/ClinicFAQ';
import ClinicContacts from './clinic/ClinicContacts';

// Поднимаемся на уровень выше и идем в components
import PersonalPage from '../components/clinic/Doctors/PersonalPage';
import MethodCardPage from '../components/clinic/Methods/CardPage';

export default function RouterClinic() {
  return (
    <Routes>
      <Route element={<ClinicLayout />}>
        {/* Корень раздела клиники */}
        <Route index element={<ClinicAbout />} />
        <Route path="about" element={<ClinicAbout />} />
        
        {/* Специалисты */}
        <Route path="doctors" element={<ClinicDoctors />} />
        <Route path="doctors/:id" element={<PersonalPage />} />

        {/* Методики */}
        <Route path="methods" element={<ClinicMethods />} />
        <Route path="methods/:id" element={<MethodCardPage />} />
     
        {/* Доп. страницы */}
        <Route path="prices" element={<ClinicPrices />} />
        <Route path="awards" element={<ClinicAwards />} />
        <Route path="faq" element={<ClinicFAQ />} />
        <Route path="contacts" element={<ClinicContacts />} />
      </Route>
    </Routes>
  );
}
