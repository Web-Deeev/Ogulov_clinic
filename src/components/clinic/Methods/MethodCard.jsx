import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MethodCard({ method }) {
  const navigate = useNavigate();

  if (!method) return null;

  const title = method.title || method.name || 'Методика оздоровления';
  const description = method.short_desc || method.description || 'Описание находится в процессе наполнения.';
  const slug = method.slug || method.id;
  const imageUrl = method.image || 'https://placehold.co';

  // Единый метод навигации для всей карточки
  const handleNavigate = () => {
    navigate(`/clinic/methods/${slug}`);
  };

  return (
    <div 
      className="method-card cursor-pointer" 
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
    >
      {/* 1. Блок картинки сверху */}
      <div className="method-card__image overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          loading="lazy" 
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* 2. Контентный блок снизу */}
      <div className="method-card__content">
        <div className="method-card__text-group">
          <span className="method-card__badge">Методика лечения</span>
          <h3 className="method-card__title">{title}</h3>
          <p className="method-card__desc">{description}</p>
        </div>
        
        {/* Кнопка «Подробнее» — фирменная желтая капсула */}
        <div className="method-card__actions">
          <button 
            className="method-card__btn-more"
            onClick={(e) => {
              e.stopPropagation(); // Защита от всплытия (Double Navigation)
              handleNavigate();
            }}
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
}
