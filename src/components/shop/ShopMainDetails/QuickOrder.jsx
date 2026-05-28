import React, { useState } from 'react';
import shopService from '@/api/shopService';

export function QuickOrderModal({ id, title, onClose }) {
  const [fastName, setFastName] = useState('');
  const [fastPhone, setFastPhone] = useState('+996 ');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Обработчик ввода телефона с защитой маски Кыргызстана
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith('+996 ')) return;
    setFastPhone(value);
  };

  // Сабмит формы быстрой покупки в 1 клик
  const handleFastSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    // Удаляем все пробелы для проверки базовой длины строки
    const cleanPhone = fastPhone.replace(/\s+/g, '');
    if (cleanPhone.length < 13) {
      setApiError("Пожалуйста, введите корректный номер телефона Кыргызстана!");
      setIsSubmitting(false);
      return;
    }

    try {
      // Отправляем пакет данных в наш единый сервис shopService
      await shopService.createOrder({
        name: fastName,
        phone: cleanPhone,
        address: "",
        comments: "Быстрый заказ в 1 клик с витрины фронтенда",
        items: [{ productId: id, quantity: 1 }]
      });

      // Если бэк вернул 201 Created — очищаем стейты и включаем экран успеха
      setIsSuccess(true);
      setFastName('');
      setFastPhone('+996 ');

      // Автоматически закрываем окно через 3 секунды успеха
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      console.error('Ошибка при отправке быстрого заказа:', err);
      
      // Читаем точные массивы ошибок от RegexValidator и сериализатора Django
      const djangoPhoneError = err.response?.data?.phone?.[0];
      const djangoNameError = err.response?.data?.name?.[0];
      const djangoGeneralError = err.response?.data?.detail;
      
      // Выводим пользователю точечную ошибку из БД
      setApiError(
        djangoPhoneError || 
        djangoNameError || 
        djangoGeneralError || 
        'Не удалось отправить заявку. Проверьте введенные данные.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }; // 🎯 Все скобки функции handleFastSubmit теперь закрыты идеально!

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
      onClick={() => !isSubmitting && onClose()} // Запрещаем закрывать во время отправки запроса
    >
      <div 
        className="bg-white p-4 rounded-4 shadow-lg border" 
        style={{ width: '100%', maxWidth: '360px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()} // Защита от закрытия модалки при клике на саму форму
      >
        {/* КНОПКА КРЕСТИКА Х */}
        <button 
          type="button"
          className="position-absolute border-0 bg-transparent fs-4 text-muted" 
          style={{ top: '10px', right: '15px', cursor: 'pointer', outline: 'none' }}
          onClick={onClose}
          disabled={isSubmitting}
        >
          &times;
        </button>

        <div className="text-center mb-3">
          <h5 className="fw-bold text-dark mb-1">Быстрый заказ</h5>
          <p className="text-muted small">Оставьте контактные данные, менеджер клиники перезвонит вам</p>
        </div>

        {/* ПРЕВЬЮ НАЗВАНИЯ ТОВАРА */}
        <div className="p-2 bg-light rounded text-center small mb-3 text-truncate fw-semibold border text-secondary">
          📦 {title}
        </div>

        {/* ЕСЛИ ЗАКАЗ УСПЕШНО СОЗДАН В БАЗЕ DJANGO */}
        {isSuccess ? (
          <div className="alert alert-success text-center py-4 rounded-3 mb-0" role="alert">
            <h6 className="fw-bold mb-1 fs-6">Заявка принята!</h6>
            <p className="small mb-0 text-muted">Менеджер клиники скоро свяжется с вами.</p>
          </div>
        ) : (
          /* ИНТЕРФЕЙС ФОРМЫ ВВОДА ДАННЫХ */
          <form onSubmit={handleFastSubmit}>
            {/* ОШИБКИ ВАЛИДАЦИИ СЕРВЕРА */}
            {apiError && <div className="alert alert-danger py-2 small rounded-2 mb-2">{apiError}</div>}

            <div className="mb-2">
              <label className="form-label small fw-semibold text-secondary mb-1">Ваше имя *</label>
              <input 
                type="text" 
                className="form-control form-control-sm rounded-2" 
                placeholder="Имя" 
                required 
                value={fastName} 
                onChange={(e) => setFastName(e.target.value)} 
                disabled={isSubmitting} 
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary mb-1">Telephone в Киргизии *</label>
              <input 
                type="tel" 
                className="form-control form-control-sm rounded-2 fw-bold" 
                placeholder="+996 555 123 456" 
                required 
                value={fastPhone} 
                onChange={handlePhoneChange} 
                disabled={isSubmitting} 
              />
            </div>

            {/* ДИНАМИЧЕСКАЯ КНОПКА С КРУТИЛКОЙ ЗАГРУЗКИ */}
            <button 
              type="submit" 
              className="btn btn-sm w-100 fw-bold py-2 text-white border-0 rounded-3 d-flex align-items-center justify-content-center" 
              style={{ backgroundColor: '#1a1d20' }} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <> 
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> 
                  ОТПРАВКА... 
                </>
              ) : 'ОТПРАВИТЬ ЗАЯВКУ'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
