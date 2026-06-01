import React from 'react';
import PropTypes from 'prop-types';

const AwardCard = React.memo(({ award, onOpenLightbox }) => {
  if (!award) return null;

  return (
    <div className="clinic-awards__card">
      {/* ИСПРАВЛЕНО: Убран window.open, теперь клик безопасно триггерит стейт лайтбокса на странице */}
      <div 
        className="clinic-awards__image-wrapper"
        onClick={onOpenLightbox} 
        title="Нажмите для увеличения"
        style={{ cursor: 'zoom-in' }} // Визуальный индикатор возможности увеличения
      >
        <img 
          src={award.image} 
          alt={award.title || 'Документ центра'} 
          className="clinic-awards__img" 
          loading="lazy"
        />
      </div>
      {/* Текст удален по ТЗ, чтобы не портить внешний вид */}
    </div>
  );
});

AwardCard.propTypes = {
  award: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onOpenLightbox: PropTypes.func.isRequired, // Колбэк для открытия встроенной модалки
};

export default AwardCard;
