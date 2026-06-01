import React, { useState, useEffect } from 'react';
import MethodCard from '../../components/clinic/Methods/MethodCard.jsx';
import MethodCardSkeleton from '../../components/clinic/Methods/SkeletonCard.jsx'; // Наш новый импорт
import { clinicApi } from '../../api/clinic/clinic.js'; 
import '../../components/clinic/Methods/MethodCard.css';

export default function ClinicMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    clinicApi.getMethods()
      .then(response => {
        setMethods(response.data || []);
      })
      .catch(error => {
        console.error("Ошибка загрузки методик с бэкенда через Axios:", error);
        setMethods([]);
      })
      .finally(() => setLoading(false)); // Наш стандарт: закрываем лоадер в любом случае
  }, []);

  return (
   
    <section className="clinic-methods-page">
      <div className="container">
        
        {/* Шапка секции */}
        <div className="clinic-doctors-page__header">
          <span className="clinic-subtitle">Наши оздоровительные практики</span>
          <h1 className="clinic-title">Методики Лечения</h1>
          <div className="clinic-divider"></div>
        </div>

        {/* Сетка контента */}
        <div className="clinic-methods-grid">
          {loading ? (
            <>
              
              <MethodCardSkeleton />
              <MethodCardSkeleton />
            </>
          ) : methods.length > 0 ? (
            methods.map((method) => (
              <MethodCard key={method.id} method={method} />
            ))
          ) : (
            <div className="clinic-empty" style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
              Список методик временно пуст или обновляется.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
