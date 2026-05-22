import { NavLink, useLocation } from 'react-router-dom'
import './Header.css'

const clinicMenu = [
  { title: 'Главная', href: '/' },
  { title: 'О клинике', href: '/clinic/about' },
  { title: 'Методики', href: '/clinic/methods' },
  { title: 'Специалисты', href: '/clinic/specialists' },
  { title: 'Награды', href: '/clinic/awards' },
  { title: 'Вопросы-ответы', href: '/clinic/faq' },
  { title: 'Контакты', href: '/clinic/contacts' },
]

const shopMenu = [
  { title: 'О магазине', href: '/shop/about' },
  { title: 'Оплата', href: '/shop/payment' },
  { title: 'Доставка', href: '/shop/delivery' },
  { title: 'Контакты', href: '/shop/contacts' },
]

export default function Header() {
  const { pathname } = useLocation()
  const isShop = pathname.startsWith('/shop')

  const menu = isShop ? shopMenu : clinicMenu

  return (
    <header className="site-header">
      <div className="site-tabs">
        <div className="container site-tabs__inner">
          <NavLink
            to="/"
            className={({ isActive }) =>
              !isShop ? 'site-tab site-tab--active' : 'site-tab'
            }
          >
            Клиника
          </NavLink>

          <NavLink
            to="/shop"
            className={() =>
              isShop ? 'site-tab site-tab--active' : 'site-tab'
            }
          >
            Интернет магазин
          </NavLink>
        </div>
      </div>

      <div className="site-main-header">
        <div className="container site-main-header__inner">
          <NavLink to={isShop ? '/shop' : '/'} className={isShop ? 'site-logo2' : 'site-logo'}>
            <img
              src={isShop ? '/images/shop-logo.png' : '/images/logo.svg'}
              alt={isShop ? 'Интернет магазин' : 'Клиника Огулова'}
            />

            <div className="site-logo__text">
              {isShop ? '' : 'Клиника Огулова'}
            </div>
          </NavLink>

          <div className="site-header-info">
            <div className="site-address">
              <span>Адрес и режим работы</span>
              <div className="site-address__popup">
                <p>
                  Москва,
                  <br />
                  проспект Маршала Жукова, д. 78
                  <br />
                  корп. 4 и корп. 2
                </p>
                <p>
                  Пн-Пт, 10:00-21:00
                  <br />
                  Сб, 10:00-18:00
                  <br />
                  Вс, выходной
                </p>
              </div>
            </div>

            <a href="tel:+78005504795" className="site-phone">
              <span>8 800 </span>550-47-95
            </a>

            <div className="site-socials">
              <a href="#">
                <img src="/images/fb-icon.png" alt="Facebook" />
              </a>
              <a href="#">
                <img src="/images/vk-icon.png" alt="VK" />
              </a>
              <a href="#">
                <img src="/images/inst-icon.png" alt="Instagram" />
              </a>
              <a href="#">
                <img src="/images/yt-icon.png" alt="YouTube" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <nav className="site-nav">
        <div className="container">
          <ul className="site-nav__list">
            {menu.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
                  }
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}




