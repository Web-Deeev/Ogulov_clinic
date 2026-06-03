import { NavLink, Link, useLocation } from 'react-router-dom'; // Импортируем чистый Link
import { HashLink } from 'react-router-hash-link'; 
import './Header.css';

// ВАЖНО: Переводим меню клиники на честные многостраничные роуты из App.jsx
const clinicMenu = [
  { title: 'Главная', href: '/clinic' },
  { title: 'О клинике', href: '/clinic/about' }, // Плавный скролл к секции "О нас" на странице About
  { title: 'Специалисты', href: '/clinic/doctors' }, // Честный переход на изолированную страницу врачей
  { title: 'Методики', href: '/clinic/methods' }, // Переход на страницу методик
  { title: 'Награды', href: '/clinic/awards' },
  { title: 'Вопросы-ответы', href: '/clinic/faq' },
  { title: 'Контакты', href: '/clinic/contacts' },
];

const shopMenu = [
  { title: 'О магазине', href: '/shop/about' },
  { title: 'Оплата', href: '/shop/payment' },
  { title: 'Доставка', href: '/shop/delivery' },
  { title: 'Контакты', href: '/shop/contacts' },
];

export default function Header() {
  const { pathname } = useLocation();
  
  // 🎯 СЕНИОР-ФИКС ДЛЯ HASHROUTER: Проверяем и pathname, и реальный хэш в адресной строке
  const isShop = pathname.startsWith('/shop') || window.location.hash.startsWith('#/shop');

  const menu = isShop ? shopMenu : clinicMenu;

  return (
    <header className="site-header">
      {/* Верхние табы переключения Клиника / Магазин */}
      <div className="site-tabs">
        <div className="container site-tabs__inner">
          <NavLink
            to="/clinic" // Переводим на базовую страницу клиники
            className={() => !isShop ? 'site-tab site-tab--active' : 'site-tab'}
          >
            Клиника
          </NavLink>

          <NavLink
            to="/shop"
            className={() => isShop ? 'site-tab site-tab--active' : 'site-tab'}
          >
            Интернет магазин
          </NavLink>
        </div>
      </div>

      {/* Центральная часть шапки (Логотип, Контакты) */}
      <div className="site-main-header">
        <div className="container site-main-header__inner">
          
          {/* 🎯 СЕНИОР-ФИКС: Прописываем пути в 'to' строго с учетом хэша через '#' 
              и добавляем принудительный сброс стейта роутера */}
          <Link 
            to={isShop ? '/shop/' : '/clinic'} 
            className={isShop ? 'site-logo2' : 'site-logo'}
            onClick={() => {
              // Явно выставляем хэш для браузера
              window.location.hash = isShop ? '#/shop/' : '#/clinic';
            }}
          >
            <img
              src={isShop ? '/images/shop-logo.png' : '/images/logo.svg'}
              alt={isShop ? 'Интернет магазин' : 'Клиника Огулова'}
            />
            <div className="site-logo__text">
              {isShop ? '' : 'Клиника Огулова'}
            </div>
          </Link>

          <div className="site-header-info">
            <div className="site-address">
              <span>Адрес и режим работы</span>
              <div className="site-address__popup">
                <p>Москва,<br />проспект Маршала Жукова, д. 78<br />корп. 4 и korп. 2</p>
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
