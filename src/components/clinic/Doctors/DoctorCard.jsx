import React from 'react';

export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="doctor-card">
      <div className="doctor-card__image">
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          onError={(e) => { e.target.src = 'https://placehold.co' }}
        />
      </div>
      <div className="doctor-card__info">
        <span className="doctor-card__role">{doctor.role}</span>
        <h3 className="doctor-card__name">{doctor.name}</h3>
        <span className="doctor-card__exp">{doctor.exp}</span>
        <p className="doctor-card__desc">{doctor.desc}</p>
        <button className="doctor-card__btn" onClick={() => onBook(doctor.id)}>
          Записаться на прием
        </button>
      </div>
    </div>
  );
}