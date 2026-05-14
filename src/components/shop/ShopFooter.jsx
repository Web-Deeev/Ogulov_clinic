import React from 'react';

// Компонент принимает функцию setCurrentView для управления навигацией
export default function ShopFooter({ setCurrentView }) {
  
  // Утилита для переключения экранов и автоматического плавного скролла наверх
  const handleNavigate = (e, viewName) => {
    e.preventDefault();
    // Проверяем, что функция была успешно передана из главного файла
    if (typeof setCurrentView === 'function') {
      setCurrentView(viewName);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="shop-footer">
      <div className="container shop-footer-inner">
        {/* Блок 1: Навигация по инфо-страницам */}
        <div className="shop-footer-col">
          <h4>Информация</h4>
          <a href="#about" onClick={(e) => handleNavigate(e, 'about')}>О магазине</a>
          <a href="#payment" onClick={(e) => handleNavigate(e, 'payment')}>Оплата</a>
          <a href="#delivery" onClick={(e) => handleNavigate(e, 'delivery')}>Доставка</a>
          <a href="#contacts" onClick={(e) => handleNavigate(e, 'contacts')}>Контакты</a>
        </div>

        {/* Блок 2: Личный кабинет пользователя */}
        <div className="shop-footer-col">
          <h4>Личный кабинет</h4>
          <a href="#login" onClick={(e) => handleNavigate(e, 'login')}>Вход</a>
          <a href="#register" onClick={(e) => handleNavigate(e, 'register')}>Регистрация</a>
          <a href="#forgot" onClick={(e) => handleNavigate(e, 'forgot')}>Забыли пароль?</a>
        </div>

        {/* Блок 3: Социальные сети Представительства */}
        <div className="shop-footer-col">
          <h4>Мы в соц сетях</h4>
          <a href="https://ok.ru" target="_blank" rel="noreferrer">Одноклассники</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
        </div>
      </div>

      {/* Нижняя плашка со значками платежных систем */}
      <div className="shop-payments container">
        <div className="shop-payments-inner">
          <span className="pay-badge mircard">МИР</span>
          <span className="pay-badge visa">VISA</span>
          <span className="pay-badge mastercard">Mastercard</span>
        </div>
      </div>
    </footer>
  );
}
