import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header/Header';
import DoctorCard from '../../components/clinic/Doctors/DoctorCard'; 
import { mockDoctors } from '../../components/clinic/Doctors/DoctorsData'; 
import '../../components/clinic/Doctors/DoctorCard.css'; 

export default function ClinicDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDoctors(mockDoctors);
      setLoading(false);
    }, 300); 
    return () => clearTimeout(timer);
  }, []);

  const leaderDoctor = doctors.length > 0 ? doctors[0] : null;
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
                {/* Скелетон для премиум-баннера руководителя, защищающий от сдвига контента (CLS) */}
                <div className="doctor-card-skeleton doctor-card-skeleton--fullwidth" style={{ width: '100%', marginBottom: '40px' }}></div>
                
                {/* Скелетоны для рядовых сотрудников в сетке */}
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
                {/* 1. БАННЕР ОГУЛОВА: Рендерится отдельно ВНЕ грид-сетки */}
                {leaderDoctor && (
                  <div className="clinic-doctors-leader" style={{ width: '100%', marginBottom: '40px' }}>
                    <DoctorCard doctor={leaderDoctor} isFullWidth={true} />
                  </div>
                )}

                {/* Аккуратный заголовок-разделитель для остальных сотрудников */}
                {staffDoctors.length > 0 && (
                  <h2 className="clinic-doctors__section-title">Специалисты центра</h2>
                )}

                {/* 2. ГРИД-СЕТКА: Открывается ТОЛЬКО для рядовых врачей */}
                <div className="clinic-doctors-grid">
                  {staffDoctors.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}
