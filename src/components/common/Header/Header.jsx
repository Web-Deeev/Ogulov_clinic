import { NavLink, useLocation } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link' // Импортируем HashLink для сквозного SPA-скролла
import './Header.css'

// ВАЖНО: Добавляем слеш перед хэшем, чтобы ссылки работали из любой точки сайта (даже из магазина)
const clinicMenu = [
  { title: 'Главная', href: '/#hero' },
  { title: 'Методики', href: '/#methods' },
  { title: 'О клинике', href: '/#about' },
  { title: 'Специалисты', href: '/#doctors' },
  { title: 'Награды', href: '/#awards' },
  { title: 'Вопросы-ответы', href: '/#faq' },
  { title: 'Контакты', href: '/#contacts' },
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
          {/* Логотип использует HashLink для возврата наверх главной страницы */}
          <HashLink smooth to={isShop ? '/shop' : '/#hero'} className={isShop ? 'site-logo2' : 'site-logo'}>
            <img
              src={isShop ? '/images/shop-logo.png' : '/images/logo.svg'}
              alt={isShop ? 'Интернет магазин' : 'Клиника Огулова'}
            />
            <div className="site-logo__text">
              {isShop ? '' : 'Клиника Огулова'}
            </div>
          </HashLink>

          <div className="site-header-info">
            <div className="site-address">
              <span>Адрес и режим работы</span>
              <div className="site-address__popup">
                <p>Москва,<br />проспект Маршала Жукова, д. 78<br />корп. 4 и корп. 2</p>
                <p>Пн-Пт, 10:00-21:00<br />Сб, 10:00-18:00<br />Вс, выходной</p>
              </div>
            </div>

            <a href="tel:+78005504795" className="site-phone">
              <span>8 800 </span>550-47-95
            </a>

            <div className="site-socials">
              <a href="#"><img src="/images/fb-icon.png" alt="Facebook" /></a>
              <a href="#"><img src="/images/vk-icon.png" alt="VK" /></a>
              <a href="#"><img src="/images/inst-icon.png" alt="Instagram" /></a>
              <a href="#"><img src="/images/yt-icon.png" alt="YouTube" /></a>
            </div>
          </div>
        </div>
      </div>

      <nav className="site-nav">
        <div className="container">
          <ul className="site-nav__list">
            {menu.map((item) => (
              <li key={item.title}>
                {isShop ? (
                  /* Обычные роуты для страниц магазина */
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
                    }
                  >
                    {item.title}
                  </NavLink>
                ) : (
                  /* Умный SPA-скролл для клиники, работающий из любой точки сайта */
                  <HashLink
                    smooth
                    to={item.href}
                    className="site-nav__link"
                  >
                    {item.title}
                  </HashLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
