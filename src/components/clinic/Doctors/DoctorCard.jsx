import React from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link для динамического роутинга
import './DoctorCard.css';

export default function DoctorCard({ doctor, onBook, isFullWidth = false }) {
  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    // Безопасный размер заглушки для защиты от зацикливания 404 ошибок
    e.currentTarget.src = 'https://placehold.co';
  };

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
            {doctor.role || doctor.position || 'Основоположник центра'}
          </span>
          
          <h3 className="doctor-card__name">
            {doctor.name}
          </h3>
          
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
            {/* Кнопка "Подробнее" переведена на честную навигацию роутера */}
            <Link 
              to={`/clinic/doctors/${doctor.slug }`} 
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
  // ВАРИАНТ 2: СТАНДАРТНАЯ ВЕРТИКАЛЬНАЯ КАРТОЧКА (Остальные специалисты)
  // ==========================================================================
  return (
    <div className="doctor-card">
      <div className="doctor-card__image">
        <img 
          src={doctorPhoto} 
          alt={doctor.name} 
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="doctor-card__info">
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
        
        {/* Две функциональные кнопки для рядовых врачей */}
        <div className="doctor-card__item-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <button 
            className="doctor-card__btn" 
            onClick={() => onBook?.(doctor.id)}
          >
            Записаться на прием
          </button>
          
          <Link 
            to={`/clinic/doctors/${doctor.slug }`} 
            className="doctor-card__btn" 
            style={{ 
              backgroundColor: '#ffffff', 
              borderColor: '#d0c8b8', 
              textDecoration: 'none', 
              textAlign: 'center', 
              display: 'block' 
            }}
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}
