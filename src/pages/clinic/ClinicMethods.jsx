import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header/Header';
import MethodCard from '../../components/clinic/Methods/MethodCard';
import '../../components/clinic/Methods/MethodCard.css';
// ИСПРАВЛЕНО: Подключаем пуленепробиваемый модуль запросов клиники
import { clinicApi } from '../../api/clinic/clinic'; 

export default function ClinicMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // ИСПРАВЛЕНО: Вызываем готовую функцию, которая сама знает правильный URL
    clinicApi.getMethods()
      .then(response => {
        // Axios автоматически парсит JSON в поле .data
        setMethods(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки методик с бэкенда через Axios:", error);
        setMethods([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="clinic-page-wrapper">
      <Header />
      
      <main className="clinic-main-content">
        <section className="clinic-methods-page">
          <div className="container">
            
            <div className="clinic-doctors-page__header">
              <span className="clinic-subtitle">Наши оздоровительные практики</span>
              <h1 className="clinic-title">Методики Лечения</h1>
              <div className="clinic-divider"></div>
            </div>

            {loading ? (
              <div className="clinic-methods-grid">
                {Array(3).fill(0).map((_, idx) => (
                  <div key={idx} className="doctor-card-skeleton">
                    <div className="doctor-card-skeleton__img" style={{ paddingTop: '75%' }}></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="clinic-methods-grid">
                {methods.length > 0 ? (
                  methods.map((method) => (
                    <MethodCard key={method.id} method={method} />
                  ))
                ) : (
                  <div className="clinic-empty" style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                    Список методик временно пуст или обновляется.
                  </div>
                )}
              </div>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}
