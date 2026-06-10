import React from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import Header from '../../components/common/Header/Header'; 
import Footer from '../../components/common/Footer/Footer'; 
import ContactSection from '../../components/clinic/Home/ContactSection'; 

export default function ClinicLayout() {
  /* 
    🎯 БЕЗОПАСНЫЙ ТРЕКИНГ РОУТА: 
    Ваше Senior-решение проверки роута без привязки к window.location,
    полностью совместимое с HashRouter.
  */
  const isContactsPage = !!useMatch('/clinic/contacts');

  return (
    /* 
      🎯 ГЛОБАЛЬНЫЙ ФИКС ВЕРСТКИ:
      Растягиваем приложение строго на высоту экрана (minHeight: '100dvh')
      и выстраиваем элементы (Хедер, Контент, Карта, Футер) в вертикальный стек.
    */
    <div 
      className="app-wrapper" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100dvh' 
      }}
    >
      {/* Хедер клиники всегда закреплен на самом верху страницы */}
      <Header />

      {/* 
        🎯 УДЕРЖАНИЕ ФУТЕРА:
        flexGrow: 1 заставляет блок clinic-page забрать всё доступное пространство.
        Если страница пустая и бэкенд на сервере 185.141.61.174 еще грузится, 
        этот блок искусственно удерживает высоту и не дает карте и футеру прыгнуть вверх.
      */}
      <div 
        className="clinic-page" 
        style={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        <main 
          className="main-content clinic-content" 
          style={{ flexGrow: 1 }}
        >
          {/* Здесь react-router-dom плавно монтирует текущую страницу клиники */}
          <Outlet />
        </main>
      </div>

      {/* Рендерим сквозную карту только если мы НЕ на странице контактов */}
      {!isContactsPage && <ContactSection />}

      {/* Футер железно зафиксирован на дне экрана с первой миллисекунды */}
      <Footer />
    </div>
  );
}
