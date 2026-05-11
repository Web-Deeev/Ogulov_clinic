import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './clinic.css';

export default function ClinicLayout() {
  return (
    <div className="clinic-page">
      <nav className="clinic-submenu">
        <div className="container">
          <NavLink to="/" className="submenu-link">Главная</NavLink>
          <NavLink to="/clinic/about" className="submenu-link">О клинике</NavLink>
          <NavLink to="/clinic/doctors" className="submenu-link">Специалисты</NavLink>
          <NavLink to="/clinic/methods" className="submenu-link">Методы</NavLink>
          <NavLink to="/clinic/prices" className="submenu-link">Цены</NavLink>
          <NavLink to="/clinic/awards" className="submenu-link">Награды</NavLink>
          <NavLink to="/clinic/faq" className="submenu-link">Вопрос-ответ</NavLink>
          <NavLink to="/clinic/contacts" className="submenu-link">Контакты</NavLink>
        </div>
      </nav>

     
      <div className="clinic-content">
        <Outlet />
      </div>
    </div>
  );
}
