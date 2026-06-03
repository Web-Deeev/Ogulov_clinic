import React from 'react';
import { Link } from 'react-router-dom';
import './AboutIntro.css';

export default function AboutIntro({ data, mainPhoto, videoUrl = "https://youtube.com", onMainPhotoClick }) {
  return (
    <section className="about-official-intro" aria-label="Основная информация о клинике">
      <div className="container">
        <div className="about-official__grid-50-50">
          
          {/* ЛЕВАЯ КОЛОНКА: НАСТОЯЩИЙ ТЕКСТ С БЭКЕНДА */}
          <div className="about-official__content-left">
            <h1 className="about-official__title">
              {data && data.title ? data.title : "О клинике"}
            </h1>
            
            <p className="about-official__paragraph">
              Огулов Центр – это учебно-оздоровительный центр, который был создан 19 октября 1995 года Огуловым Александром Тимофеевичем. До 2019 года Центр носил название Учебно-оздоровительный центр “Предтеча”.
            </p>

            <div className="about-official__directions-box">
              <p className="about-official__directions-intro">Направления работы:</p>
              <ul className="about-official__directions-list">
                <li><strong>Клиника</strong> — где наши пациенты проходят различные оздоровительные процедуры</li>
                <li><strong>Академия</strong> — где наши преподаватели проводят обучение различным методикам оздоровления для всех желающих.</li> 
              </ul>
            </div>

            <p className="about-official__paragraph">
              Также, более 20 лет существует «Профессиональная ассоциация специалистов висцеральных практик», состоящая из выпускников нашей Академии. Все выпускники обучающих программ нашей Академии имеют возможность вступить в это сообщество близких по духу и мышлению специалистов, получить доступ к закрытым чатам и материалам, специальным предложениям и скидкам.
            </p>

            <h2 className="about-official__subtitle">О висцеральной практике</h2>
            <p className="about-official__paragraph about-official__paragraph--highlight">
              Висцеральная практика - это массаж внутренних органов через переднюю стенку живота посредством надавливания, простукивания, сдвижения, с целью восстановления положения органов и восстановления микроциркуляции в их околоорганных пространствах. За счет этих действий убираются спазмы, венозные застои, происходит нормализация многих обменных процессов в организме и устранение функциональных расстройств, происходят глубокие физиологические процессы, приводящие к восстановлению не только работы внутренних органов, но и всего организма в целом. В работе нашей Клиники используются не имеющие аналогов в мире авторские методики А.Т. Огулова, которые успешно применяются уже более 20 лет.
            </p>

            <Link to="/clinic/methods/visceralnaya-praktika" className="about-official__method-btn">
              Подробнее →
            </Link>
          </div>

          {/* ПРАВАЯ КОЛОНКА (50%): ТЕПЕРЬ ТУТ ЖИВОЙ БАННЕР С ССЫЛКОЙ НА ВИДЕО (STICKY) */}
          <div className="about-official__content-right">
            <div 
              className="about-official__sticky-image-box about-official__main-img-wrapper" 
              onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <img 
                src={mainPhoto || '/images/about-main.jpg'} 
                alt="Профессор Александр Тимофеевич Огулов" 
                className="about-official__main-img"
                loading="eager"
              />
              {/* Наш красивый оверлей с кнопкой плей */}
              <div className="about-clinic__video-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(43, 37, 33, 0.4)', color: '#ffffff' }}>
                <div className="play-button" style={{ width: '64px', height: '64px', backgroundColor: '#ffffff', color: '#a47bb0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  ▶
                </div>
                <span style={{ fontWeight: '600', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Смотреть презентацию
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
