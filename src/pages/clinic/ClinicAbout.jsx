import React from 'react';
import { NavLink } from 'react-router-dom';
import './clinic.css';

export default function ClinicAbout() {
  return (
    <div className="clinic-page">
 

      {/* Подменю клиники */}
      <nav className="clinic-submenu">
        <div className="container">
          <NavLink to="/" className="submenu-link"end>Главная</NavLink>
          <NavLink to="/clinic/about" className="submenu-link">О клинике</NavLink>
          <NavLink to="/clinic/doctors" className="submenu-link">Специалисты</NavLink>
          <NavLink to="/clinic/methods" className="submenu-link">Методы</NavLink>
          <NavLink to="/clinic/prices" className="submenu-link">Цены</NavLink>
          <NavLink to="/clinic/awards" className="submenu-link">Награды</NavLink>
          <NavLink to="/clinic/faq" className="submenu-link">Вопрос-ответ</NavLink>
          <NavLink to="/clinic/contacts" className="submenu-link">Контакты</NavLink>
        </div>
      </nav>

      {/* Главный баннер */}
      <section className="clinic-banner">
        <h1>О клинике</h1>
        <p>Огулов Центр – учебно-оздоровительный центр с более чем 20-летней историей</p>
      </section>

      {/* Основной контент */}
      <section className="clinic-about">
        <h2>О клинике</h2>
        <p>
          Огулов Центр – это учебно-оздоровительный центр, который был создан 19 октября 1995 года 
          Огуловым Александром Тимофеевичем. До 2019 года Центр носил название Учебно-оздоровительный центр “Предтеча”.
        </p>

        <h3>Основные направления</h3>
        <ul>
          <li>
            <strong>Клиника:</strong> наши пациенты проходят различные оздоровительные процедуры.
          </li>
          <li>
            <strong>Академия:</strong> преподаватели проводят обучение различным методикам оздоровления для всех желающих.
          </li>
        </ul>

        <p>
          Более 20 лет существует «Профессиональная ассоциация специалистов висцеральных практик», 
          состоящая из выпускников Академии. Все выпускники имеют возможность вступить в сообщество специалистов, 
          получить доступ к закрытым материалам, чатам и специальным предложениям.
        </p>

        <h3>О висцеральной практике</h3>
        <p>
          Висцеральная практика – это массаж внутренних органов через переднюю стенку живота: 
          надавливание, простукивание и сдвижение с целью восстановления положения органов 
          и микроциркуляции в их околоорганных пространствах.
        </p>

        <p>
          Данные действия снимают спазмы, устраняют венозные застои, нормализуют обменные процессы и 
          функциональные расстройства организма. В работе клиники применяются уникальные авторские методики А.Т. Огулова, успешно используемые более 20 лет.
        </p>
      </section>
    </div>
  );
}