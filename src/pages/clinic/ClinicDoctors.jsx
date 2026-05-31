import React, { useState, useEffect } from 'react';
import DoctorCard from '../../components/clinic/Doctors/DoctorCard.jsx'; 
import DoctorCardSkeleton from '../../components/clinic/Doctors/SkeletonCard.jsx';
import api from '../../api/axios.js'; 
import '../../components/clinic/Doctors/DoctorCard.css';


export default function ClinicDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('clinic/doctors/')
      .then(res => setDoctors(res.data || []))
      .catch(err => console.error("Ошибка API:", err))
      .finally(() => setLoading(false));
  }, []);

  const leaderDoctor = doctors.length > 0 ? doctors[0] : null;
  const staffDoctors = doctors.length > 1 ? doctors.slice(1) : []; 

  return (
    <section className="clinic-doctors-page">
      <div className="container">
        
        <div className="clinic-doctors-page__header">
          <span className="clinic-subtitle">Команда профессионалов</span>
          <h1 className="clinic-title">Наши Специалисты</h1>
          <div className="clinic-divider"></div>
        </div>

        {/* SOLID: Логика загрузки использует один атомарный компонент с разными пропсами */}
        {loading ? (
          <>
            {/* 1 большой скелетон для Огулова */}
            <DoctorCardSkeleton isFullWidth={true} />
            
            {/* Сетка из 3 стандартных скелетонов для персонала */}
            <div className="clinic-doctors-grid">
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
            </div>
          </>
        ) : (
          <>
            {/* Рендеринг реальных данных из Django REST Framework */}
            {leaderDoctor && (
              <div className="clinic-doctors-leader">
                <DoctorCard doctor={leaderDoctor} isFullWidth={true} />
              </div>
            )}

            {staffDoctors.length > 0 && (
              <h2 className="clinic-doctors__section-title">Специалисты центра</h2>
            )}

            <div className="clinic-doctors-grid">
              {staffDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
