import React from 'react';
import { Link } from 'react-router-dom';
import './DoctorCard.css';

export default function DoctorCard({ doctor, isFullWidth = false }) {
  // Жесткий Guard clause: если объект врача не пришел или пришел пустой массив
  if (!doctor || Array.isArray(doctor)) return null;

  // Django возвращает абсолютный URL картинки из /media/
  const doctorPhoto = doctor.image || 'https://placehold.co';

  // ==========================================================================
  // ВАРИАНТ 1: ГОРИЗОНТАЛЬНЫЙ ПРЕМИУМ-БАННЕР (Александр Огулов)
  // ==========================================================================
  if (isFullWidth) {
    return (
      <div 
        className="doctor-card doctor-card--fullwidth"
        style={{ backgroundImage: `url(${doctorPhoto})` }}
      >
        <div className="doctor-card__overlay"></div>
        
        <div className="doctor-card__info">
          <span className="doctor-card__role">
            {doctor.role ? doctor.role : 'Руководитель центра'}
          </span>
          
          <h3 
            className="doctor-card__name"
            dangerouslySetInnerHTML={{ __html: doctor.name || 'Специалист центра' }}
          />
          
          {doctor.exp && (
            <span className="doctor-card__exp">
              {doctor.exp}
            </span>
          )}
          
          {/* СТАНДАРТНОЕ ПОЛЕ: Краткое описание с защитой от переполнения */}
          <div className="doctor-card__desc-wrapper">
            <p className="doctor-card__desc">
              {doctor.desc || 'Описание обновляется...'}
            </p>
          </div>
          
          <div className="doctor-card__actions">
            <Link 
              to={`/clinic/doctors/${doctor.slug}`} 
              className="doctor-card__more-btn"
            >
              Подробнее
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // ВАРИАНТ 2: СТАНДАРТНАЯ КАРТОЧКА (Рядовые сотрудники)
  // ==========================================================================
  return (
    <div className="doctor-card doctor-card--standard">
      <div className="doctor-card__content-block">
        <div className="doctor-card__text-group">
          <span className="doctor-card__role">
            {doctor.role ? doctor.role : 'Специалист центра'}
          </span>
          
          <h3 className="doctor-card__name">
            {doctor.name}
          </h3>
          
          {doctor.exp && (
            <span className="doctor-card__exp">
              {doctor.exp}
            </span>
          )}
          
          {/* СТАНДАРТНОЕ ПОЛЕ: Краткое описание */}
          <p className="doctor-card__desc">
            {doctor.desc || 'Описание обновляется...'}
          </p>
        </div>
        
        <div className="doctor-card__item-actions">
          <Link 
            to={`/clinic/doctors/${doctor.slug}`} 
            className="doctor-card__btn doctor-card__btn--more"
          >
            Подробнее
          </Link>
        </div>
      </div>

      <div 
        className="doctor-card__bg-image"
        style={{ backgroundImage: `url(${doctorPhoto})` }}
      />
    </div>
  );
}
