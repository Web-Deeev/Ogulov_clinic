import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx'; // 🟢 ДОБАВЛЕНО: Подключаем ядро контекста
import shopService from '@/api/shop';

export function QuickOrderModal({ id, title, onClose }) {
  // 🟢 ДОБАВЛЕНО: Извлекаем профиль залогиненного пациента и статус авторизации
  const { userProfile, isAuthenticated } = useContext(ShopContext);

  const [fastName, setFastName] = useState('');
  const [fastPhone, setFastPhone] = useState('+996 ');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  // =========================================================================
  // 🎯 АВТОМАТИЧЕСКИЙ ПОДТЯГ ДАННЫХ ПРОФИЛЯ ПРИ ОТКРЫТИИ (KISS-ГИДРАТАЦИЯ)
  // =========================================================================
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      // Собираем полное имя, убирая лишние пробелы
      const fullName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
      setFastName(fullName || userProfile.username || '');
      
      // Форматируем телефон под строгий Kyrgyzstan-мапинг
      let rawPhone = userProfile.phone || '';
      if (rawPhone) {
        const cleanRaw = rawPhone.replace(/\s+/g, '');
        if (cleanRaw.startsWith('+')) {
          setFastPhone(cleanRaw);
        } else if (cleanRaw.startsWith('996')) {
          setFastPhone(`+${cleanRaw}`);
        } else {
          setFastPhone(`+996${cleanRaw}`);
        }
      }
    }
  }, [userProfile, isAuthenticated]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith('+996 ')) return;
    setFastPhone(value);
  };

  const handleFastSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    const cleanPhone = fastPhone.replace(/\s+/g, '');
    if (cleanPhone.length < 13) {
      setApiError("Пожалуйста, введите корректный номер телефона Киргизии!");
      setIsSubmitting(false);
      return;
    }

    try {
      await shopService.createOrder({
        customer_name: fastName.trim(),
        phone: cleanPhone,
        delivery_address: `Быстрый заказ в 1 клик. Товар: ${title}`, 
        delivery_method: 'PICKUP',
        comment: "Быстрый заказ в 1 клик с витрины фронтенда",
        items: [{ product_id: id, quantity: 1 }]
      });

      setIsSuccess(true);
      // Очищаем форму только для гостей, для авторизованных оставляем данные на месте
      if (!isAuthenticated) {
        setFastName('');
        setFastPhone('+996 ');
      }

      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      console.error('Ошибка при отправке быстрого заказа:', err);
      const serverErrors = err.response?.data;
      
      if (serverErrors && typeof serverErrors === 'object') {
        const djangoPhoneError = serverErrors.phone?.[0];
        const djangoNameError = serverErrors.customer_name?.[0] || serverErrors.name?.[0];
        const djangoGeneralError = serverErrors.detail;
        
        setApiError(djangoPhoneError || djangoNameError || djangoGeneralError || 'Не удалось отправить заявку.');
      } else {
        setApiError('Не удалось связаться с сервером клиники. Проверьте сеть.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
      onClick={() => !isSubmitting && onClose()}
    >
      <div 
        className="bg-white p-4 rounded-4 shadow-lg border" 
        style={{ width: '100%', maxWidth: '360px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
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
        <div className="p-2 bg-light rounded text-center small mb-3 text-truncate fw-semibold border text-secondary" title={title}>
          📦 {title}
        </div>

        {/* ЭКРАН УСПЕШНОГО СОХРАНЕНИЯ В СУБД */}
        {isSuccess ? (
          <div className="alert alert-success text-center py-4 rounded-3 mb-0" role="alert">
            <h6 className="fw-bold mb-1 fs-6">🎉 Заявка принята!</h6>
            <p className="small mb-0 text-muted">Менеджер клиники Огулова скоро свяжется с вами.</p>
          </div>
        ) : (
          /* ИНТЕРФЕЙС ФОРМЫ ВВОД ДАННЫХ */
          <form onSubmit={handleFastSubmit}>
            {apiError && <div className="alert alert-danger py-2 small rounded-2 mb-2">⚠️ {apiError}</div>}

            <div className="mb-2">
              <label className="form-label small fw-semibold text-secondary mb-1">Ваше имя *</label>
              <input 
                type="text" 
                className="form-control form-control-sm rounded-2 shadow-none" 
                placeholder="Имя" 
                required 
                value={fastName} 
                onChange={(e) => setFastName(e.target.value)} 
                disabled={isSubmitting} 
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary mb-1">Телефон в Кыргызстане *</label>
              <input 
                type="tel" 
                className="form-control form-control-sm rounded-2 fw-bold shadow-none" 
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
              className="btn btn-sm w-100 fw-bold py-2 text-white border-0 rounded-3 d-flex align-items-center justify-content-center shadow-sm" 
              style={{ backgroundColor: '#1a1d20' }} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <> 
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> 
                  ОТПРАВКА ЗАЯВКИ... 
                </>
              ) : 'ОТПРАВИТЬ ЗАЯВКУ'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
