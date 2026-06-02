import React, { useState, Suspense } from 'react';
import '../../components/clinic/Contacts/contacts.css';

// Senior-практика: Ленивый импорт изолирует виджет 2ГИС в отдельный легкий чанк
const TwoGisMap = React.lazy(() => import('../../components/clinic/Contacts/2gis.jsx'));

// Централизованный справочник данных по филиалам (Полный аналог структуры оф. сайта)
const BRANCHES_DATA = {
  vostok: {
    title: 'Филиал Восток (Центр)',
    address: 'г. Бишкек, ул. Исанова, д. 42/1 (пересекает пр. Чуй)',
    schedule: [
      'Пн-Пт: 10:00 - 21:00',
      'Сб: 10:00 - 18:00',
      'Вс: выходной'
    ],
    phones: ['+996 (312) 66-00-00', '+996 (555) 123-456'],
    email: 'vostok@ogulov.kg',
    mapLink: 'https://2gis.kg' // Пример точной ссылки для кнопки навигатора
  },
  zapad: {
    title: 'Филиал Запад (Джал)',
    address: 'г. Бишкек, мкр. Джал-23, д. 59 (по Южной Магистрали)',
    schedule: [
      'Пн-Пт: 09:00 - 19:00',
      'Сб: 09:00 - 16:00',
      'Вс: выходной'
    ],
    phones: ['+996 (707) 123-456', '+996 (777) 987-654'],
    email: 'jhal@ogulov.kg',
    mapLink: 'https://2gis.kg'
  }
};

export default function ClinicContacts() {
  const [activeBranch, setActiveBranch] = useState('vostok');

  // Безопасное извлечение текущего дата-объекта (защита от undefined/крашей примитивов)
  const currentBranch = BRANCHES_DATA[activeBranch] || BRANCHES_DATA.vostok;

  // Функция для очистки номера телефона от маски, чтобы корректно работала ссылка tel:
  const cleanPhone = (phoneStr) => phoneStr.replace(/[^\d+]/g, '');

  return (
    <div className="clinic-contacts-page">
      <section className="clinic-banner">
        <div className="container">
          <h1 className="clinic-banner__title">Контакты</h1>
          <p className="clinic-banner__subtitle">Учебно-оздоровительный центр висцеральной терапии</p>
        </div>
      </section>

      <section className="contacts-content container contacts-container">
        <div className="contacts-grid">
          
          {/* ЛЕВАЯ КОЛОНКА (ДИНАМИЧЕСКИЕ КАРТОЧКИ) */}
          <div className="contacts-info-panel">
            <div className="contacts-tabs">
              {Object.keys(BRANCHES_DATA).map((key) => (
                <button 
                  key={key}
                  className={`contacts-tab-btn ${activeBranch === key ? 'contacts-tab-btn--active' : ''}`}
                  onClick={() => setActiveBranch(key)}
                >
                  {BRANCHES_DATA[key].title}
                </button>
              ))}
            </div>

            <div className="contacts-card-details">
              {/* Адрес */}
              <div className="contacts-detail-item">
                <span className="contacts-label">Адрес:</span>
                <p className="contacts-value">{currentBranch.address}</p>
                <a 
                  href={currentBranch.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="contacts-navi-btn"
                >
                  🗺️ Открыть в навигаторе 2ГИС
                </a>
              </div>

              {/* График работы */}
              <div className="contacts-detail-item">
                <span className="contacts-label">График работы:</span>
                <div className="contacts-value">
                  {currentBranch.schedule.map((line, idx) => (
                    <p key={idx} className="m-0">{line}</p>
                  ))}
                </div>
              </div>

              {/* Телефоны */}
              <div className="contacts-detail-item">
                <span className="contacts-label">Телефоны:</span>
                <div className="contacts-value">
                  {currentBranch.phones.map((phone, idx) => (
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
                  <a href={`mailto:${currentBranch.email}`} className="contacts-link">
                    {currentBranch.email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА (КАРТА С ЗАЩИТОЙ ОТ ПЕРЕГРУЗКИ) */}
          <div className="contacts-map-panel">
            <Suspense fallback={
              <div className="twogis-map-container flex items-center justify-center text-stone-500 bg-stone-50 rounded-2xl h-[450px]">
                <div className="animate-pulse">Загрузка интерактивной карты...</div>
              </div>
            }>
              <TwoGisMap activeBranch={activeBranch} />
            </Suspense>
          </div>

        </div>
      </section>
    </div>
  );
}