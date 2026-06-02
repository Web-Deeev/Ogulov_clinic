import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/common/Header/Header'; 
import Footer from '../../components/common/Footer/Footer'; 
import ContactSection from '../../components/clinic/Home/ContactSection'; 

export default function ClinicLayout() {
  const location = useLocation();

  // 🎯 САМЫЙ КРАСИВЫЙ И ЖЕСТКИЙ ФИКС БЕЗ ХУКОВ И СОБЫТИЙ:
  // Прямо здесь проверяем, если URL содержит слово 'contacts', 
  // намертво запрещаем рендерить нижнюю сквозную карту.
  const isContactsPage = location.pathname.includes('contacts') || window.location.hash.includes('contacts');

  return (
    <div className="app-wrapper">
      <Header />

      <div className="clinic-page">
        <main className="main-content clinic-content">
          <Outlet />
        </main>
      </div>

      {/* 🎯 Рендерим сквозную карту только если мы НЕ на странице контактов */}
      {!isContactsPage && <ContactSection />}

      <Footer />
    </div>
  );
}
