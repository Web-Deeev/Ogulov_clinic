import { useState } from 'react'
import { methods } from '../../../data/clinicData'
import './MethodsSlider.css'

function MethodCard({ item }) {
  return (
    <a href={item.link} className="method-card2">
      <div
        className="method-card2__image"
        style={{
          backgroundImage: `url(${item.image})`,
        }}
      />

      <div className="method-card2__body">
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
    </a>
  )
}

export default function MethodsSlider() {
  const [index, setIndex] = useState(0)

  const nextSlide = () => {
    setIndex((prev) =>
      prev >= methods.length - 3 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? methods.length - 3 : prev - 1
    )
  }

  return (
    <section className="methods-section">
      <div className="site-container">

        <div className="methods-section__top">
          <div>
            <h2>Методики</h2>
          </div>
        </div>

        <div className="methods-slider">
          <button
            className="methods-arrow methods-arrow--left"
            onClick={prevSlide}
          >
            ←
          </button>

          <div className="methods-slider__viewport">
            <div
              className="methods-slider__track"
              style={{
                transform: `translateX(calc(-${index} * (33.333% + 20px)))`,
              }}
            >
              {methods.map((item) => (
                <MethodCard item={item} key={item.title} />
              ))}
            </div>
          </div>

          <button
            className="methods-arrow methods-arrow--right"
            onClick={nextSlide}
          >
            →
          </button>
        </div>

        <div className="methods-section__bottom">
          <a href="/clinic/methods" className="methods-all-btn">
            ПОСМОТРЕТЬ ВСЕ МЕТОДИКИ
          </a>
        </div>
      </div>
    </section>
  )
}