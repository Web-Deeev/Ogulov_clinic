import React, { useState, Suspense } from 'react';
import '../../components/clinic/Contacts/contacts.css';
import Tab from '../../components/clinic/Contacts/Tab.jsx';
import Detail from '../../components/clinic/Contacts/Detail.jsx';
import { BRANCHES_DATA } from '../../components/clinic/Contacts/info.js'; 

// Ленивый импорт тяжелого холста карты (ИСПРАВЛЕНО: строка import 2gis удалена, чтобы не ломать Vite)
const TwoGisMap = React.lazy(() => import('../../components/clinic/Contacts/2gis.jsx'));

export default function ClinicContacts() {
  const [activeBranch, setActiveBranch] = useState('vostok');
  
  // Безопасное извлечение текущего филиала из импортированных данных
  const currentBranch = BRANCHES_DATA[activeBranch] || BRANCHES_DATA.vostok;

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
          
          {/* ЛЕВАЯ КОЛОНКА (КОМПОНЕНТЫ УПРАВЛЕНИЯ И ДАННЫХ) */}
          <div className="contacts-info-panel">
            <Tab 
              branches={BRANCHES_DATA} 
              activeBranch={activeBranch} 
              onSelect={setActiveBranch} 
            />
            <Detail branch={currentBranch} />
          </div>

          {/* ПРАВАЯ КОЛОНКА (ЛЕНИВАЯ КАРТА СО СКЕЛЕТОНОМ) */}
          <div className="contacts-map-panel">
            <Suspense fallback={
              <div className="twogis-map-container animate-pulse">
                <div>Загрузка интерактивной карты...</div>
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
