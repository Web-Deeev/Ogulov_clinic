import React from 'react';
import DoctorCard from '../../components/clinic/Doctors/DoctorCard';

const doctorsData = [
  {
    id: 1,
    name: 'Огулов Александр Тимофеевич',
    role: 'Основатель центра, профессор',
    desc: 'Доктор народной медицины, основоположник направления висцеральной практики в России.',
    exp: 'Более 40 лет опыта',
    image: '/images/doctors/ogulov.jpg',
  },
  {
    id: 2,
    name: 'Хазова Ольга Петровна',
    role: 'Ведущий специалист центра',
    desc: 'Специалист по висцеральной практике, гирудотерапии, юмейхо-терапии и фитотерапии.',
    exp: 'Более 20 лет опыта',
    image: '/images/doctors/hazova.jpg',
  }
];

export default function ClinicDoctors() {
  const handleBooking = (id) => {
    alert(`Открытие модалки записи к доктору с ID: ${id}`);
  };

  return (
    <div className="container clinic-doctors-page">
      <h1 className="page-title">Специалисты клиники</h1>
      <p className="page-subtitle">Наши эксперты — сертифицированные специалисты.</p>

      <div className="doctors-grid">
        {doctorsData.map((doctor) => (
          <DoctorCard 
            key={doctor.id} 
            doctor={doctor} 
            onBook={handleBooking} 
          />
        ))}
      </div>
    </div>
  );
}