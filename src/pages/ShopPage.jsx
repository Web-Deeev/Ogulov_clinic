import '../style.css'
import ShopBanner from '../components/shop/ShopBanner'

const hits = [
  {
    title: 'Книга "Клиническая анатомия человека"',
    image: '/images/shop/products/hit-1.jpg',
    price: '4 200 руб.',
    label: 'Хит',
  },
  {
    title: 'Плакат 3 в 1',
    image: '/images/shop/products/hit-2.jpg',
    price: '3 100 руб.',
    label: 'Хит',
  },
  {
    title: 'Устройство очистки ПВВК',
    image: '/images/shop/products/hit-3.jpg',
    price: '11 800 руб.',
    label: 'Хит',
  },
  {
    title: 'Методы функциональной диагностики',
    image: '/images/shop/products/hit-4.jpg',
    price: '4 200 руб.',
    label: 'Хит',
  },
  {
    title: 'Универсальные палочки Ахмат',
    image: '/images/shop/products/hit-5.jpg',
    price: '8 800 руб.',
  },
  {
    title: 'Большой плакат 3 в 1',
    image: '/images/shop/products/hit-6.jpg',
    price: '1 700 руб.',
    label: 'Хит',
  },
]

const news = [
  {
    title: 'Массажная рукавица',
    image: '/images/shop/products/new-1.jpg',
    price: '1 850 руб.',
    label: 'Рекомендовано',
  },
  {
    title: 'Скребок Гуаша для массажа',
    image: '/images/shop/products/new-2.jpg',
    price: '1 780 руб.',
    label: 'Рекомендовано',
  },
  {
    title: 'Скребок для массажа',
    image: '/images/shop/products/new-3.jpg',
    price: '1 780 руб.',
    label: 'Рекомендовано',
  },
  {
    title: 'Скребок для массажа Гуаша',
    image: '/images/shop/products/new-4.jpg',
    price: '1 780 руб.',
    label: 'Рекомендовано',
  },
  {
    title: 'Скребок для массажа',
    image: '/images/shop/products/new-5.jpg',
    price: '1 850 руб.',
    label: 'Рекомендовано',
  },
  {
    title: 'Скребок для массажа',
    image: '/images/shop/products/new-6.jpg',
    price: '1 780 руб.',
    label: 'Рекомендовано',
  },
]

const sales = [
  {
    title: 'Книга "Анатомия человека"',
    image: '/images/shop/products/sale-1.jpg',
    oldPrice: '3 200 руб.',
    price: '2 720 руб.',
    label: 'Скидка 15%',
  },
  {
    title: 'Устройство очистки ПВВК',
    image: '/images/shop/products/sale-2.jpg',
    oldPrice: '13 900 руб.',
    price: '11 800 руб.',
    label: 'Скидка 15%',
  },
  {
    title: 'Пластырь "Витон"',
    image: '/images/shop/products/sale-3.jpg',
    oldPrice: '650 руб.',
    price: '550 руб.',
    label: 'Скидка 15%',
  },
  {
    title: 'Поясница не могу ходить',
    image: '/images/shop/products/sale-4.jpg',
    oldPrice: '1 200 руб.',
    price: '1 020 руб.',
    label: 'Скидка 15%',
  },
]

function ShopTopBar() {
  return (
    <div className="shop-topbar">
      <div className="container shop-topbar-inner">
        <div>Ваш город: Бишкек</div>
        <div className="shop-topbar-right">
          <span>Список желаний (0)</span>
          <span>Личный кабинет</span>
        </div>
      </div>
    </div>
  )
}

function ShopHeader() {
  return (
    <header className="shop-header">
      <div className="container shop-header-inner">
        <a href="/shop" className="shop-logo">
          <img src="/images/shop-logo.png" alt="Магазин" />
        </a>

        <div className="shop-center">
          <nav className="shop-info-menu">
            <a href="#">О магазине</a>
            <a href="#">Оплата</a>
            <a href="#">Доставка</a>
            <a href="#">Контакты</a>
          </nav>

          <div className="shop-search">
            <input placeholder="Поиск" />
            <button>🔍</button>
          </div>
        </div>

        <div className="shop-actions">
          <div className="shop-phone-title">Отправить сообщение &nbsp; Обратный звонок</div>
          <div className="shop-phone">89067237823</div>
          <button className="shop-cart">Корзина: пусто</button>
        </div>
      </div>
    </header>
  )
}

function ShopMenu() {
  const items = [
    { title: 'Книги', href: '/shop/categories/knigi' },
    { title: 'Плакаты Огулова А.Т.', href: '#' },
    { title: 'Пищевые добавки/БАД', href: '#' },
    { title: 'Микросферы', href: '#' },
    { title: 'Устройство очистки ПВВК', href: '#' },
    { title: 'Скребки/Массажеры', href: '#' },
    { title: 'Банки', href: '#' },
    { title: 'Остальные категории', href: '#' },
  ]

  return (
    <nav className="shop-menu container p-0">
      <div className="container p-0">
        <ul className="shop-menu-list p-0">
          {items.map((item) => (
            <li key={item.title} className="shop-menu-item p-0">
              <a className="p-0" href={item.href}>{item.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

function ProductCard({ product }) {
  return (
    <div className="shop-product">
      <div className="shop-product-image">
        {product.label && (
          <div className={product.label === 'Рекомендовано' ? 'badge badge-blue' : 'badge'}>
            {product.label}
          </div>
        )}
        <img src={product.image} alt={product.title} />
      </div>

      <div className="shop-product-title">{product.title}</div>

      {product.oldPrice && <div className="shop-product-old">{product.oldPrice}</div>}
      <div className="shop-product-price">{product.price}</div>
    </div>
  )
}

function ProductSection({ title, products }) {
  return (
    <section className="shop-section">
      <h2>{title}</h2>

      <div className="shop-products-grid">
        {products.map((product) => (
          <ProductCard product={product} key={product.title} />
        ))}
      </div>
    </section>
  )
}

function ShopFooter() {
  return (
    <footer className="shop-footer">
      <div className="container shop-footer-inner">
        <div>
          <h4>Информация</h4>
          <a href="#">О магазине</a>
          <a href="#">Оплата</a>
          <a href="#">Доставка</a>
          <a href="#">Контакты</a>
        </div>

        <div>
          <h4>Личный кабинет</h4>
          <a href="#">Вход</a>
          <a href="#">Регистрация</a>
          <a href="#">Забыли пароль?</a>
        </div>

        <div>
          <h4>Мы в соц сетях</h4>
          <a href="#">Одноклассники</a>
          <a href="#">YouTube</a>
        </div>
      </div>

      <div className="shop-payments">
        <span>Mastercard</span>
        <span>VISA</span>
        <span>МИР</span>
      </div>
    </footer>
  )
}

export default function ShopHomePage() {
  return (
    <div className="shop-page">
      <ShopTopBar />
      <ShopHeader />
      <ShopMenu />

      <main className="container shop-home">
        <ShopBanner />

        <ProductSection title="Хиты продаж" products={hits} />
        <ProductSection title="Новинки" products={news} />
        <ProductSection title="Скидки" products={sales} />
      </main>

      <div className="shop-gray-block">
        <div className="container">
          <img src="/images/shop/social-widget.jpg" alt="" />
        </div>
      </div>

      <ShopFooter />
    </div>
  )
}