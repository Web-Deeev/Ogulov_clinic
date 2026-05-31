import React from 'react';
// Импортируем твой готовый компонент карточки методики
import MethodCard from '../Methods/MethodCard.jsx'; 
import './GridMethods.css';

export default function DoctorMethodsSlider({ methods }) {
  // KISS: Если методик нет, ничего не рендерим
  if (!methods || methods.length === 0) return null;

  return (
    <div className="doctor-personal__methods-section">
      <div className="doctor-personal__section-header">
        <h2 className="doctor-personal__block-title">Практикуемые методики лечения</h2>
        <div className="doctor-personal__title-line"></div>
      </div>

      {/* Горизонтальная карусель на чистом CSS */}
      <div className="doctor-methods-native-slider">
        {methods.map((method) => (
          <div key={method.id} className="doctor-methods-native-slide">
            <MethodCard method={method} />
          </div>
        ))}
      </div>
    </div>
  );
}
