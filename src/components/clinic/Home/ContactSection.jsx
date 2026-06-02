import React, { useState, Suspense } from 'react';
import Tab from '../Contacts/Tab.jsx';
import Detail from '../Contacts/Detail.jsx';
import { BRANCHES_DATA } from '../Contacts/info.js';

// Твоя ленивая карта pigeon-maps
const TwoGisMap = React.lazy(() => import('../Contacts/2gis.jsx'));

export default function ContactsSection() {
  const [activeBranch, setActiveBranch] = useState('vostok');
  const currentBranch = BRANCHES_DATA[activeBranch] || BRANCHES_DATA.vostok;

  return (
    <section className="contacts-fullscreen-section" style={{ position: 'relative', width: '100%', height: '600px', overflow: 'hidden' }}>
      
      {/* 1. ПОЛОТНО КАРТЫ НА ВСЮ ШИРИНУ И ВЫСОТУ СЕКЦИИ */}
      <div className="fullscreen-map-wrapper" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <Suspense fallback={
          <div className="animate-pulse" style={{ width: '100%', height: '100%', backgroundColor: '#f4f2ee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a817c' }}>
            Загрузка интерактивной карты...
          </div>
        }>
          <TwoGisMap activeBranch={activeBranch} height={600} />
        </Suspense>
      </div>

      {/* 2. ПЛАВАЮЩАЯ КАРТОЧКА С КОНТАКТАМИ (Высота auto, без лишнего заголовка) */}
      <div className="container" style={{ position: 'relative', height: '100%', zIndex: 2, pointerEvents: 'none' }}>
        <div 
          className="floating-contacts-panel" 
          style={{ 
            position: 'absolute', 
            top: '40px', 
            left: '20px', 
            width: '400px', 
            height: 'auto', 
            backgroundColor: '#ffffff', 
            borderRadius: '12px', 
            padding: '32px', 
            boxShadow: '0 12px 40px rgba(43, 37, 33, 0.15)', 
            border: '1px solid #e8e4dc',
            pointerEvents: 'auto', 
            boxSizing: 'border-box'
          }}
        >
          {/* 🎯 ФИКС: Заголовок <h2>Наши филиалы</h2> полностью удален для экономии места */}
          
          {/* Твои табы переключения городов */}
          <Tab 
            branches={BRANCHES_DATA} 
            activeBranch={activeBranch} 
            onSelect={setActiveBranch} 
          />
          
          {/* Твоя карточка деталей адреса и телефонов с уменьшенным верхним отступом */}
          <div style={{ marginTop: '16px' }}>
            <Detail branch={currentBranch} />
          </div>
        </div>
      </div>

      {/* Адаптивный CSS-реверс для мобильных устройств */}
      <style>{`
        @media (max-width: 768px) {
          .contacts-fullscreen-section { height: auto !important; display: flex; flex-direction: column-reverse; }
          .fullscreen-map-wrapper { position: relative !important; height: 380px !important; }
          .floating-contacts-panel { position: relative !important; top: 0 !important; left: 0 !important; width: 100% !important; border-radius: 0 !important; box-shadow: none !important; border-left: none; border-right: none; padding: 24px !important; }
          .contacts-fullscreen-section .container { padding: 0 !important; width: 100% !important; height: auto !important; }
        }
      `}</style>
    </section>
  );
}
