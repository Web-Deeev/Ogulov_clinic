
import { useState } from 'react'
import { specialists } from '../../../data/specialists'
import './Specialists.css'

export default function Specialists() {
  const [current, setCurrent] = useState(0)

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? specialists.length - 1 : prev - 1
    )
  }

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === specialists.length - 1 ? 0 : prev + 1
    )
  }

  const currentSpec = specialists[current]

  const prevSpec =
    specialists[
      current === 0
        ? specialists.length - 1
        : current - 1
    ]

  const nextSpec =
    specialists[
      current === specialists.length - 1
        ? 0
        : current + 1
    ]

  return (
    <section className="specialists">
      <div className="container-fluid p-0">
        <h2 className="specialists__title">
          Наши специалисты
        </h2>

        <div className="specialists-slider">
          <div className="specialists-side left">
            <img
              src={prevSpec.image}
              alt={prevSpec.name}
            />
          </div>

          <div className="specialists-main">
            <div className="specialists-content">
              <h3>
                {currentSpec.name}
                <br />
                {currentSpec.surname}
              </h3>

              <p>{currentSpec.description}</p>

              <button>Подробнее</button>
            </div>

            <div className="specialists-image">
              <img
                src={currentSpec.image}
                alt={currentSpec.name}
              />

              <div className="specialists-nav">
                <button onClick={prevSlide}>
                  ←
                </button>

                <button onClick={nextSlide}>
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="specialists-side right">
            <img
              src={nextSpec.image}
              alt={nextSpec.name}
            />
          </div>
        </div>

        <div className="specialists-all">
          <a href="/specialists">
            Все специалисты →
          </a>
        </div>
      </div>
    </section>
  )
}