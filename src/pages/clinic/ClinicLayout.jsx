import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/common/Header/Header'; 
import Footer from '../../components/common/Footer/Footer'; 

export default function ClinicLayout() {
  return (
    <div className="app-wrapper">
      {/* 1. Глобальная шапка сайта (внутри нее уже есть всё меню) */}
      <Header />

      {/* 2. Чистая контентная область для медицинских страниц */}
      <div className="clinic-page">
        <main className="main-content clinic-content">
          {/* Сюда автоматически подставляются ClinicAbout, ClinicDoctors, ClinicMethods и т.д. */}
          <Outlet />
        </main>
      </div>

      {/* 3. Глобальный трехколоночный футер с дисклеймером */}
      <Footer />
    </div>
  );
}
