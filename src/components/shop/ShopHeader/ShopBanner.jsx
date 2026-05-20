export default function ShopBanner() {
  return (
    <div
      id="shopBanner"
      className="carousel slide shop-banner"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">

        <div className="carousel-item active">
          <img
            src="/images/banner-1.jpeg"
            className="d-block w-100"
            alt="banner"
          />
        </div>

        <div className="carousel-item">
          <img
            src="/images/banner-2.png"
            className="d-block w-100"
            alt="banner"
          />
        </div>

      </div>
 
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#shopBanner"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#shopBanner"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>

    </div>
  )
}