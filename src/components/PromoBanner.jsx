export default function PromoBanner({ imageUrl }) {
  return (
    <section className="promo-banner">
      <img
        src={imageUrl}
        alt="Промо баннер"
        className="promo-banner__image"
      />
    </section>
  )
}