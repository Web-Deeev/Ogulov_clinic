import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { NavLink } from 'react-router-dom';



export default function Header() {
  return (
    <header>
      {/* Верхняя строка с тремя разделами */}
      <div className="top-menu">
        <div className="container top-menu-inner">
          <NavLink to="/clinic/about" className="top-menu-link">Клиника</NavLink>
          <span className="divider">|</span>
          <NavLink to="/academy" className="top-menu-link">Академия</NavLink>
          <span className="divider">|</span>
          <a href="https://shop.example.com" target="_blank" rel="noopener noreferrer" className="top-menu-link">
            Интернет-магазин
          </a>
        </div>
      </div>

      {/* Основной Header */}
      <div className="top-header">
        <div className="container header-inner">
          {/* Логотип */}
          <a href="/" className="logo-wrap">
            <img src="/images/logo.png" alt="Огулов Центр" className="logo-img" />
          </a>



          {/* Адрес с Popover */}
          <div className="header-center">
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="bottom"
              delay={{ show: 120, hide: 180 }}
              container={document.body}
              overlay={
                <Popover id="address-popover" className="address-popover">
                  <Popover.Body>
                    <div className="address-popover__content">
                      <p>
                        Москва,<br />
                        проспект Маршала Жукова, д. 78<br />
                        корп. 4 и корп. 2
                      </p>
                      <p>
                        Пн-Пт, 10:00-21:00<br />
                        Сб, 10:00-18:00<br />
                        Вс, выходной
                      </p>
                    </div>
                  </Popover.Body>
                </Popover>
              }
            >
              <span className="header-link" role="button" tabIndex={0}>
                Адрес и режим работы
              </span>
            </OverlayTrigger>
          </div>

          {/* Контакты и соцсети */}
          <div className="header-right">
            <a href="tel:+78005504795" className="phone-btn">
              <span>8 800 </span>550-47-95
            </a>

            <div className="socials">
              <a href="https://www.facebook.com/ogulov.center" className="social">
                <img src="/images/fb-icon.png" alt="Facebook" />
              </a>
              <a href="#" className="social">
                <img src="/images/vk-icon.png" alt="VK" />
              </a>
              <a href="#" className="social">
                <img src="/images/inst-icon.png" alt="Instagram" />
              </a>
              <a href="#" className="social">
                <img src="/images/yt-icon.png" alt="YouTube" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}