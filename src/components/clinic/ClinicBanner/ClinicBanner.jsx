import { useEffect, useState } from 'react'
import { clinicBannerSlides } from '../../../data/clinicData'
import './ClinicBanner.css'

export default function ClinicBanner() {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeSlide = clinicBannerSlides[activeIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) =>
        current === clinicBannerSlides.length - 1 ? 0 : current + 1
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section
      className="clinic-hero"
      style={{
        backgroundImage: `url(${activeSlide.image})`,
      }}
    >
      <div className="container clinic-hero__inner">
        <div className="clinic-hero__content">
          <h1>{activeSlide.title}</h1>
          <p className="clinic-hero__text">{activeSlide.text}</p>

          <a href={activeSlide.link} className="clinic-hero__btn">
            {activeSlide.buttonText}
          </a>
        </div>
      </div>

      <div className="clinic-hero__dots">
        {clinicBannerSlides.map((_, index) => (
          <button
            key={index}
            className={
              index === activeIndex
                ? 'clinic-hero__dot clinic-hero__dot--active'
                : 'clinic-hero__dot'
            }
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  )
}