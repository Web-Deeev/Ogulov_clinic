import React from 'react';
import './Skeleton.css';

export default function DoctorCardSkeleton({ isFullWidth = false }) {
  // Выбираем базовый класс в зависимости от пропса (DRY — один компонент для двух задач)
  const cardClass = isFullWidth 
    ? 'doc-skeleton-card doc-skeleton-leader animate-pulse-eff' 
    : 'doc-skeleton-card animate-pulse-eff';

  return (
    <div className={cardClass}>
      {/* Имитация фотографии */}
      <div className="doc-skeleton-media" />
      
      {/* Имитация текстового контента */}
      <div className="doc-skeleton-content">
        <div className="doc-skeleton-line doc-w-50" />
        <div className="doc-skeleton-line doc-w-75" />
        {isFullWidth && <div className="doc-skeleton-line doc-w-30" />}
      </div>
    </div>
  );
}
