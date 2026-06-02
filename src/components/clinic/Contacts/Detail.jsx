import React from 'react';

export default function BranchDetailsCard({ branch }) {
  // Нативная очистка маски номера для корректного тега tel:
  const cleanPhone = (phoneStr) => phoneStr.replace(/[^\d+]/g, '');

  return (
    <div className="contacts-card-details">
      {/* Адрес */}
      <div className="contacts-detail-item">
        <span className="contacts-label">Адрес:</span>
        <p className="contacts-value">{branch.address}</p>
        <a 
          href={branch.mapLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="contacts-navi-btn"
        >
          Открыть в навигаторе 2ГИС
        </a>
      </div>

      {/* График работы */}
      <div className="contacts-detail-item">
        <span className="contacts-label">График работы:</span>
        <div className="contacts-value">
          {branch.schedule.map((line, idx) => (
            <p key={idx} className="m-0">{line}</p>
          ))}
        </div>
      </div>

      {/* Телефоны */}
      <div className="contacts-detail-item">
        <span className="contacts-label">Телефоны:</span>
        <div className="contacts-value">
          {branch.phones.map((phone, idx) => (
            <div key={idx}>
              <a href={`tel:${cleanPhone(phone)}`} className="contacts-link">
                {phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Почта */}
      <div className="contacts-detail-item">
        <span className="contacts-label">Электронная почта:</span>
        <p className="contacts-value">
          <a href={`mailto:${branch.email}`} className="contacts-link">
            {branch.email}
          </a>
        </p>
      </div>
    </div>
  );
}
