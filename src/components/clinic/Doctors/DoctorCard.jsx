import React from 'react';
import { Link } from 'react-router-dom';
import './DoctorCard.css';

export default function DoctorCard({ doctor, isFullWidth = false }) {
  if (!doctor) return null;

  const doctorPhoto = doctor.image || doctor.photo || 'https://placehold.co';

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
            {doctor.role || 'Основоположник центра'}
          </span>
          
          <h3 
            className="doctor-card__name"
            dangerouslySetInnerHTML={{ __html: doctor.name }}
          />
          
          {doctor.exp && (
            <span className="doctor-card__exp">
              {doctor.exp}
            </span>
          )}
          
          <div className="doctor-card__desc-wrapper">
            <p className="doctor-card__desc">
              {doctor.desc}
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
  // ВАРИАНТ 2: СТАНДАРТНАЯ КАРТОЧКА (Текст 50% слева, Фото 50% справа)
  // ==========================================================================
  return (
    <div className="doctor-card doctor-card--standard">
      {/* ЛЕВЫЙ БЛОК: Текст занимает ровно 50% ширины */}
      <div className="doctor-card__content-block">
        <div className="doctor-card__text-group">
          <span className="doctor-card__role">
            {doctor.role || 'Специалист'}
          </span>
          
          <h3 className="doctor-card__name">
            {doctor.name}
          </h3>
          
          {doctor.exp && (
            <span className="doctor-card__exp">
              {doctor.exp}
            </span>
          )}
          
          <p className="doctor-card__desc">
            {doctor.desc}
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

      {/* ПРАВЫЙ БЛОК: Фотография занимает ровно 50% ширины справа */}
      <div 
        className="doctor-card__bg-image"
        style={{ backgroundImage: `url(${doctorPhoto})` }}
      />
    </div>
  );
}
