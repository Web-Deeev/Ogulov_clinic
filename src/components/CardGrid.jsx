import { Link } from 'react-router-dom'
import { cards } from '../data/cards'

function CardItem({ title, image, href, description, logo }) {
  return (
    <Link
      to={href}
      className="grid-card"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="grid-card-overlay" />

      <div className="grid-card-content">
        <img
          src={logo || '/images/logo-symbol.png'}
          alt=""
          className="grid-card-logo"
        />

        <h3 className="grid-card-title">{title}</h3>
        <span className="grid-card-line" />
        <p className="grid-card-description">{description}</p>
      </div>
    </Link>
  )
}

export default function CardGrid() {
  return (
    <section className="cards-grid">
      {cards.map((card) => (
        <CardItem
          key={card.title}
          title={card.title}
          image={card.image}
          href={card.href}
          description={card.description}
          logo={card.logo}
        />
      ))}
    </section>
  )
}