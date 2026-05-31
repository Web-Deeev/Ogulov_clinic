import React from 'react';

export default function MethodCardSkeleton() {
  return (
    <div className="doctor-card-skeleton animate-pulse-eff" style={{ background: '#f3f4f6', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Имитируем картинку методики с пропорциями 4:3 (paddingTop 75%) */}
      <div className="doctor-card-skeleton__img" style={{ paddingTop: '75%', backgroundColor: '#e5e7eb' }} />
      {/* Текстовая заглушка под описание методики */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'col', gap: '10px' }}>
        <div style={{ width: '80%', height: '18px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
        <div style={{ width: '50%', height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px' }} />
      </div>
    </div>
  );
}
