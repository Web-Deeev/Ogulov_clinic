import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' 
import { clinicApi } from '@/api/clinic/clinic'
import DoctorCard from '../../clinic/Doctors/DoctorCard' 
import '../../clinic/Doctors/DoctorCard.css' 
import Slider from '../ui/Slider.jsx' // Чистый универсальный импорт слайдера
import Lightbox from '../ui/Lightbox.jsx'           // Чистый универсальный импорт лайтбокса
import './AboutClinic.css'

export default function AboutClinic() {
  const [ogulovData, setOgulovData] = useState(null)
  const [galleryPhotos, setGalleryPhotos] = useState([]) // Стейт для фото клиники из бэка
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(null) // Стейт для управления лайтбоксом

  useEffect(() => {
    let isMounted = true // Защита от утечек памяти при быстром переключении страниц
    setLoading(true)

    // Parallel Request: Загружаем Огулова и фотографии центра одновременно
    Promise.all([
      clinicApi.getDoctors(),
      clinicApi.getClinicGallery() 
    ])
    .then(([doctorsRes, galleryRes]) => {
      if (!isMounted) return

      // 1. Вытаскиваем Огулова из общего списка
      const doctorsList = Array.isArray(doctorsRes?.data) ? doctorsRes.data : (doctorsRes?.data?.results || [])
      const foundOgulov = doctorsList.find(doc => doc.slug === 'ogulov-aleksandr-timofeevich')
      if (foundOgulov) setOgulovData(foundOgulov)

      // 2. Вытаскиваем остальные фотографии клиники
      const photosList = Array.isArray(galleryRes?.data) ? galleryRes.data : (galleryRes?.data?.results || [])
      setGalleryPhotos(photosList)
    })
    .catch(error => console.error("Ошибка API при подгрузке данных страницы:", error))
    .finally(() => {
      if (isMounted) setLoading(false)
    })

    return () => {
      isMounted = false // Чистим подписку при размонтировании
    }
  }, [])

  // Навигация внутри лайтбокса по кругу (Чистые изолированные функции)
  const showPrev = () => {
    if (galleryPhotos.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1));
  };

  const showNext = () => {
    if (galleryPhotos.length <= 1) return;
    setActiveImageIndex((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="method-detail-status-container" style={{ padding: '100px 0', textAlign: 'center', color: '#70655c' }} aria-busy="true">
        Загрузка данных Огулов Центра...
      </div>
    );
  }

  return (
    <section className="about-clinic-official">
      <div className="container">

        {/* ========================================================================= */}
        {/* БЛОК 1: СТРОГАЯ СЕТКА 50/50 (ТЕКСТ СЛЕВА, 1 ГЛАВНОЕ ФОТО СПРАВА)           */}
        {/* ========================================================================= */}
        <div className="about-official__grid-50-50">
          
          {/* ЛЕВАЯ СТОРОНА: ОФИЦИАЛЬНАЯ ИСТОРИЯ И ОПИСАНИЕ ПРАКТИКИ */}
          <article className="about-official__content-left">
            <h2 className="about-official__title">О клинике</h2>
            
            <p className="about-official__paragraph">
              Огулов Центр – это учебно-оздоровительный центр, который был создан 19 октября 1995 года 
              Огуловым Александром Тимофеевичем. До 2019 года Центр носил название Учебно-оздоровительный 
              центр “Предтеча”.
            </p>

            <div className="about-official__directions-box">
              <p className="about-official__directions-intro">У нашего Центра 2 основных направления:</p>
              <ul className="about-official__directions-list">
                <li><strong>Клиника</strong>, где наши пациенты проходят различные оздоровительные процедуры</li>
                <li><strong>Академия</strong>, где наши преподаватели проводят обучение различным методикам оздоровления для всех желающих.</li>
              </ul>
            </div>

            <p className="about-official__paragraph">
              Также, более 20 лет существует «Профессиональная ассоциация специалистов висцеральных практик», 
              состоящая из выпускников нашей Академии. Все выпускники обучающих программ нашей Академии имеют 
              возможность вступить в это сообщество близких по духу и мышлению специалистов, получить доступ к 
              закрытым чатам и материалам, специальным предложениям и скидкам.
            </p>

            <h3 className="about-official__subtitle">О висцеральной практике</h3>
            
            <p className="about-official__paragraph about-official__paragraph--highlight">
              Висцеральная практика - это массаж внутренних органов через переднюю стенку живота посредством 
              надавливания, простукивания, сдвижения, с целью восстановления положения органов и восстановления 
              микроциркуляции в их околоорганных пространствах.
            </p>

            <p className="about-official__paragraph">
              За счет этих действий убираются спазмы, венозные застои, происходит нормализация многих обменных 
              процессов в организме и устранение функциональных расстройств, происходят глубокие физиологические 
              процессы, приводящие к восстановлению не только работы внутренних органов, но и всего организма в целом. 
              В работе нашей Клиники используются не имеющие аналогов в мире авторские методики А.Т. Огулова, 
              которые успешно применяются уже более 20 лет.
            </p>

            {/* КНОПКА «ПОДРОБНЕЕ О МЕТОДИКЕ» */}
            <div className="about-official__method-action" style={{ marginTop: '25px', marginBottom: '15px' }}>
              <Link 
                to="/clinic/methods/visceralnaya-praktika" 
                className="about-official__method-btn"
              >
                Подробнее о методике &rarr;
              </Link>
            </div>
          </article>

          {/* ПРАВАЯ СТОРОНА: 1 ГЛАВНОЕ СКАЧАННОЕ ФОТО (STICKY-ЭФФЕКТ) */}
          <aside className="about-official__photo-right">
            <div className="about-official__main-img-wrapper">
              <img 
                src="/images/about-main.jpg" 
                alt="Главный зал клиники Огулов Центра" 
                className="about-official__main-img"
                loading="eager" 
              />
            </div>
          </aside>

        </div>

        {/* ========================================================================= */}
        {/* БЛОК 2: УНИВЕРСАЛЬНЫЙ СЛАЙДЕР ГАЛЕРЕИ ЦЕНТРА (ИДЕАЛЬНО ЧИСТЫЙ ВЫЗОВ)      */}
        {/* ========================================================================= */}
        <Slider 
          items={galleryPhotos}
          title="Галерея нашего центра"
          renderItem={(photo, index) => (
            <button 
              type="button"
              className="about-official__slide-btn" // Чистый класс по БЭМ
              onClick={() => setActiveImageIndex(index)}
              aria-label={`Открыть фото ${index + 1} во весь экран`}
            >
              <img 
                src={photo.image} 
                alt={photo.title || "Интерьер Огулов Центра"} 
                className="about-official__slide-img"
                loading="lazy" 
              />
            </button>
          )}
        />

        {/* ========================================================================= */}
        {/* БЛОК 4: ЧИСТЫЙ ИНТЕГРИРОВАННЫЙ ЛАЙТБОКС (ВЫЗОВ В ОДНУ СТРОКУ)              */}
        {/* ========================================================================= */}
        <Lightbox 
          photos={galleryPhotos}
          activeIndex={activeImageIndex}
          onClose={() => setActiveImageIndex(null)}
          onPrev={showPrev}
          onNext={showNext}
        />

        {/* ========================================================================= */}
        {/* БЛОК 3: САМЫЙ НИЗ СТРАНИЦЫ: ЖИВОЙ ДИНАМИЧЕСКИЙ ПРЕМИУМ-БАННЕР ОГУЛОВА       */}
        {/* ========================================================================= */}
        {ogulovData && (
          <div className="about-official__promo-wrapper animate-fadeIn-eff" style={{ marginTop: '80px' }}>
            <DoctorCard doctor={ogulovData} isFullWidth={true} />
          </div>
        )}

      </div>
    </section>
  )
}
