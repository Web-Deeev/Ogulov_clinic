const products = [
  {
    id: 1,
    title: 'Методы функциональной диагностики',
    image: '/images/shop/book1.jpg',
    price: '4 200 руб.',
  },
  {
    id: 2,
    title: 'Клиническая анатомия человека',
    image: '/images/shop/book2.jpg',
    price: '4 200 руб.',
  },
  {
    id: 3,
    title: 'Анатомия человека',
    image: '/images/shop/book3.jpg',
    price: '2 720 руб.',
  },
  {
    id: 4,
    title: 'Журнал Искусство исцеления',
    image: '/images/shop/book4.jpg',
    price: '350 руб.',
  },
]

const categories = [
  'Книги',
  'Плакаты Огулова А.Т.',
  'Пищевые добавки/БАД',
  'Микросферы',
  'Устройство очистки ПВВК',
  'Скребки/Массажеры',
  'Банки',
]

export default function ShopCategoryPage() {
  return (
    <div className="shop-page">
      <div className="shop-topbar">
        <div className="container shop-topbar-inner">
          <div>Ваш город: Бишкек</div>
          <div className="shop-topbar-links">
            <span>Список желаний (0)</span>
            <span>Личный кабинет</span>
          </div>
        </div>
      </div>

      <header className="shop-header">
        <div className="container shop-header-inner">
          <div className="shop-logo">
            <img src="/images/logo.png" alt="Магазин" />
            <span>МАГАЗИН</span>
          </div>

          <div className="shop-header-center">
            <nav className="shop-mini-nav">
              <a href="#">О магазине</a>
              <a href="#">Оплата</a>
              <a href="#">Доставка</a>
              <a href="#">Контакты</a>
            </nav>

            <div className="shop-search">
              <input type="text" placeholder="Поиск" />
              <button>⌕</button>
            </div>
          </div>

          <div className="shop-header-right">
            <div className="shop-phone">89067237823</div>
            <button className="shop-cart-btn">Корзина: пусто</button>
          </div>
        </div>
      </header>

      <nav className="shop-categories-bar">
        <div className="container shop-categories-inline">
          {categories.map((item) => (
            <a href="#" key={item}>
              {item}
            </a>
          ))}
        </div>
      </nav>

      <main className="container shop-main">
        <aside className="shop-sidebar">
          <div className="shop-box">
            <div className="shop-box-title">Книги</div>
            <div className="shop-side-list">
              {categories.map((item) => (
                <a href="#" key={item}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="shop-box">
            <div className="shop-box-title">Фильтры</div>
            <div className="shop-filter-block">
              <label>Цена (руб.)</label>
              <div className="shop-price-inputs">
                <input type="text" placeholder="350" />
                <input type="text" placeholder="4200" />
              </div>
              <button className="shop-apply-btn">Применить</button>
            </div>
          </div>
        </aside>

        <section className="shop-content">
          <div className="shop-content-header">
            <div>
              <h1>Книги</h1>
              <div className="shop-breadcrumbs">Главная &gt; Каталог &gt; Книги</div>
            </div>

            <div className="shop-sort">
              <select>
                <option>Без сортировки</option>
              </select>
            </div>
          </div>

          <div className="shop-products-grid">
            {products.map((product) => (
              <div className="shop-product-card" key={product.id}>
                <div className="shop-product-image-wrap">
                  <img src={product.image} alt={product.title} />
                </div>

                <div className="shop-product-title">{product.title}</div>
                <div className="shop-product-price">{product.price}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}