import React, { useState, useEffect } from 'react'
import { clinicApi } from '@/api/clinic/clinic' // Твой официальный слой API-запросов
import DoctorCard from '../../clinic/Doctors/DoctorCard' // Твой готовый компонент карточки
import './AboutClinic.css'


export default function AboutClinic() {
  const [ogulovData, setOgulovData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Делаем асинхронный запрос к DRF бэкенду, чтобы забрать профиль Огулова по слагу
    clinicApi.getDoctorBySlug('ogulov')
      .then(response => {
        setOgulovData(response.data)
      })
      .catch(error => {
        console.error("Ошибка при подгрузке баннера Огулова на главной:", error)
        setOgulovData(null)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="about-clinic">
      <div className="container">
        
        {/* ТВОЯ ОРИГИНАЛЬНАЯ ВЕРХНЯЯ СЕТКА ГРИДОВ (БЕЗ ИЗМЕНЕНИЙ) */}
        <div className="about-clinic__grid">
          <div className="about-clinic__content">
            <h2>О клинике</h2>

            <p>
              Огулов Центр – это учебно-оздоровительный центр, 
              который был создан 19 октября 1995 года Огуловым 
              Александром Тимофеевичем. До 2019 года Центр носил 
              название Учебно-оздоровительный центр “Предтеча”. 
              Также, более 20 лет существует «Профессиональная 
              ассоциация специалистов висцеральных практик», 
              состоящая из выпускников нашей Академии. Все 
              выпускники обучающих программ нашей Академии имеют 
              возможность вступить в это сообщество близких по 
              духу и мышлению специалистов, получить доступ к 
              закрытым чатам и материалам, специальным предложениям 
              и скидкам.
            </p>

            <div className="about-clinic__doctor">
              <img
                src="/images/ogulov.jpg"
                alt="Огулов Александр Тимофеевич"
              />

              <h3>Огулов Александр Тимофеевич</h3>

              <p>
                Генеральный директор Учебно-оздоровительного 
                Огулов Центра. Президент Профессиональной 
                ассоциации специалистов висцеральных практик, 
                профессор народной медицины, действительный 
                член международной Европейской Академии 
                Естественных наук (Ганновер. Германия). 
                Основоположник и исследователь направления 
                "Висцеральная практика" - массаж внутренних 
                органов через переднюю стенку живота.
              </p>
            </div>

            <a href="/about" className="about-clinic__link">
              Подробнее о клинике →
            </a>
          </div>

          <div className="about-clinic__gallery">
            <div
              className="about-clinic__video"
              onClick={() =>
                window.open(
                  'https://youtube.com',
                  '_blank'
                )
              }
            >
              <img
                src="/images/about-main.jpg"
                alt="О клинике"
              />

              <div className="about-clinic__video-overlay">
                <div className="about-clinic__play">
                  ▶
                </div>

                <span>
                  Посмотрите видео
                  <br />
                  об Огулов Центре
                </span>
              </div>
            </div>

            <div className="about-clinic__photos">
              <img src="/images/about-1.jpg" alt="" />
              <img src="/images/about-2.jpg" alt="" />
              <img src="/images/about-3.jpg" alt="" />
              <img src="/images/about-4.jpg" alt="" />
            </div>
          </div>
        </div>

        {/* 🔥 ДИНАМИЧЕСКИЙ БАННЕР ИЗ БАЗЫ ДАННЫХ DJANGO С УСЛОВИЕМ И КЛАССАМИ */}
        {!loading && ogulovData && (
          <div style={{ marginTop: '60px' }} className="animate-fadeIn-eff">
            <DoctorCard doctor={ogulovData} isFullWidth={true} />
          </div>
        )}

      </div>
    </section>
  )
}
