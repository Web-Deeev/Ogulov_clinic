import React from 'react';
import { Link } from 'react-router-dom';
import './MethodCard.css';

export default function MethodCard({ method }) {
  if (!method) return null;

  // Django возвращает готовую абсолютную ссылку из папки /media/
  const methodPhoto = method.image || 'https://placehold.co';

  return (
    <div className="method-card">
      {/* ВЕРХНИЙ БЛОК: Изображение методики. Пропорция 4:3 контролируется в CSS */}
      <div className="method-card__image">
        <img 
          src={methodPhoto} 
          alt={method.title} 
          loading="lazy"
        />
      </div>

      {/* НИЖНИЙ БЛОК: Текст, описание и кнопка перехода */}
      <div className="method-card__content">
        <div className="method-card__text-group">
          <span className="method-card__badge">Методика центра</span>
          <h3 className="method-card__title">{method.title}</h3>
          {/* ИСПРАВЛЕНО: Читаем short_desc в snake_case, как отдает Django API */}
          <p className="method-card__desc">{method.short_desc}</p>
        </div>

        {/* Фирменная желтая кнопка-капсула перехода к деталям по SEO-слагу */}
        <div className="method-card__actions">
          <Link 
            to={`/clinic/methods/${method.slug}`} 
            className="method-card__btn-more"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}
