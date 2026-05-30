import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header/Header';
import DoctorCard from '../../components/clinic/Doctors/DoctorCard'; 
import '../../components/clinic/Doctors/DoctorCard.css'; 
// ИСПРАВЛЕНО: Точный относительный путь к ядру Axios (src/api/axios.js)
import api from '../../api/axios'; 

export default function ClinicDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Живой запрос к Django REST Framework вместо mockDoctors
  useEffect(() => {
    setLoading(true);
    api.get('clinic/doctors/')
      .then(response => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки врачей с бэкенда:", error);
        setDoctors([]);
        setLoading(false);
      });
  }, []);

  // Вытаскиваем строго первый ОБЪЕКТ по индексу [0] для Огулова
  const leaderDoctor = doctors.length > 0 ? doctors[0] : null;
  // Рядовые врачи — все остальные объекты массива
  const staffDoctors = doctors.length > 1 ? doctors.slice(1) : []; 

  return (
    <div className="clinic-page-wrapper">
      <Header />
      <main className="clinic-main-content">
        <section className="clinic-doctors-page">
          <div className="container">
            <div className="clinic-doctors-page__header">
              <span className="clinic-subtitle">Команда профессионалов</span>
              <h1 className="clinic-title">Наши Специалисты</h1>
              <div className="clinic-divider"></div>
            </div>

            {loading ? (
              <>
                {/* Скелетоны во время ожидания ответа от Django */}
                <div className="doctor-card-skeleton doctor-card-skeleton--fullwidth" style={{ width: '100%', marginBottom: '40px' }}></div>
                <div className="clinic-doctors-grid">
                  {Array(3).fill(0).map((_, idx) => (
                    <div key={idx} className="doctor-card-skeleton">
                      <div className="doctor-card-skeleton__img"></div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* 1. БАННЕР ОГУЛОВА: Получает чистый объект */}
                {leaderDoctor && (
                  <div className="clinic-doctors-leader" style={{ width: '100%', marginBottom: '40px' }}>
                    <DoctorCard doctor={leaderDoctor} isFullWidth={true} />
                  </div>
                )}

                {/* Аккуратный заголовок-разделитель для остальных сотрудников */}
                {staffDoctors.length > 0 && (
                  <h2 className="clinic-doctors__section-title">Специалисты центра</h2>
                )}

                {/* 2. ГРИД-СЕТКА: Рядовые сотрудники (Колбина, Корчма) */}
                <div className="clinic-doctors-grid">
                  {staffDoctors.length > 0 ? (
                    staffDoctors.map(doctor => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))
                  ) : (
                    !leaderDoctor && (
                      <div className="clinic-empty" style={{ textAlign: 'center', width: '100%' }}>
                        Список специалистов обновляется.
                      </div>
                    )
                  )}
                </div>
              </>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}
