import { NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link'; 
import './Header.css';

// Роуты синхронизированы с RouterClinic.jsx
const clinicMenu = [
  { title: 'Главная', href: '/' }, 
  { title: 'О клинике', href: '/about' }, 
  { title: 'Специалисты', href: '/doctors' }, 
  { title: 'Методики', href: '/methods' }, 
  { title: 'Награды', href: '/awards' },
  { title: 'Вопросы-ответы', href: '/faq' },
  { title: 'Контакты', href: '/contacts' },
];

const shopMenu = [
  { title: 'О магазине', href: '/shop/about' },
  { title: 'Оплата', href: '/shop/payment' },
  { title: 'Доставка', href: '/shop/delivery' },
  { title: 'Контакты', href: '/shop/contacts' },
];

export default function Header() {
  const { pathname } = useLocation();
  const isShop = pathname.startsWith('/shop');

  const menu = isShop ? shopMenu : clinicMenu;

  return (
    <header className="site-header">
      {/* Верхние табы переключения Клиника / Магазин */}
      <div className="site-tabs">
        <div className="container site-tabs__inner">
          {/* 
            ИСПРАВЛЕНО (KISS): Переписали логику классов на чистые строки без деструктуризации ({isActive}).
            Если мы НЕ в магазине — таб "Клиника" железно активен. Никаких бесконечных рендеров.
          */}
          <NavLink
            to="/" 
            className={`site-tab ${!isShop ? 'site-tab--active' : ''}`}
          >
            Клиника
          </NavLink>

          <NavLink
            to="/shop"
            className={`site-tab ${isShop ? 'site-tab--active' : ''}`}
          >
            Интернет магазин
          </NavLink>
        </div>
      </div>

      {/* Центральная часть шапки (Логотип, Контакты) */}
      <div className="site-main-header">
        <div className="container site-main-header__inner">
          <NavLink to={isShop ? '/shop' : '/'} className={isShop ? 'site-logo2' : 'site-logo'}>
            <img
              src={isShop ? '/images/shop-logo.png' : '/images/logo.svg'}
              alt={isShop ? 'Интернет магазин' : 'Клиника Огулова'}
            />
            <div className="site-logo__text">
              {!isShop && 'Клиника Огулова'}
            </div>
          </NavLink>

          <div className="site-header-info">
            <div className="site-address">
              <span>Адрес и режим работы</span>
              <div className="site-address__popup">
                <p>Бишкек,<br />ул. Исанова, д. 42/1<br />мкр. Джал-23, д. 59</p>
                <p>Пн-Сб, 09:00-18:00<br />Вс, выходной</p>
              </div>
            </div>

            <a href="tel:+996555123456" className="site-phone">
              <span>+996 </span>(555) 123-456
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

       {/* Нижняя навигационная панель */}
      <nav className="site-nav">
        <div className="container">
          <ul className="site-nav__list">
            {menu.map((item) => (
              <li key={item.title}>
                {item.href.includes('#') ? (
                  <HashLink
                    smooth
                    to={item.href}
                    className="site-nav__link"
                  >
                    {item.title}
                  </HashLink>
                ) : (
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) =>
                      isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
                    }
                  >
                    {item.title}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
