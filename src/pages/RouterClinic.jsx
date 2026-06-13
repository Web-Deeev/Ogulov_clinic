import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { PageTransition } from '../components/clinic/ui/PageTransition'; // Подключаем анимацию

import ClinicLayout from './clinic/ClinicLayout';
import ClinicAbout from './clinic/ClinicAbout';
import ClinicDoctors from './clinic/ClinicDoctors';
import ClinicMethods from './clinic/ClinicMethods';
import ClinicAwards from './clinic/ClinicAwards';
import ClinicFAQ from './clinic/ClinicFAQ';
import ClinicContacts from './clinic/ClinicContacts';
import ClinicHome from './clinic/ClinicHome';

import PersonalPage from '../components/clinic/Doctors/PersonalPage';
import MethodCardPage from '../components/clinic/Methods/CardPage';

export default function RouterClinic() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/clinic" replace />} />

      <Route element={<ClinicLayout />}>
        {/* Каждую страницу бережно оборачиваем в PageTransition */}
        <Route path="clinic" element={
          <PageTransition><ClinicHome /></PageTransition>
        } />
        
        <Route path="clinic/about" element={
          <PageTransition><ClinicAbout /></PageTransition>
        } />
        
        <Route path="clinic/doctors" element={
          <PageTransition><ClinicDoctors /></PageTransition>
        } />
        
        <Route path="clinic/doctors/:id" element={
          <PageTransition><PersonalPage /></PageTransition>
        } />
        
        <Route path="clinic/methods" element={
          <PageTransition><ClinicMethods /></PageTransition>
        } />
        
        <Route path="clinic/methods/:id" element={
          <PageTransition><MethodCardPage /></PageTransition>
        } />
        
        <Route path="clinic/awards" element={
          <PageTransition><ClinicAwards /></PageTransition>
        } />
        
        <Route path="clinic/faq" element={
          <PageTransition><ClinicFAQ /></PageTransition>
        } />
        
        <Route path="clinic/contacts" element={
          <PageTransition><ClinicContacts /></PageTransition>
        } />
      </Route>
    </Routes>
  );
}
