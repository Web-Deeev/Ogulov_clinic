import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom'; 
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';
import shopService from '@/api/shop';
import confetti from 'canvas-confetti'; // 🎯 Подключаем салют
import './QuickOrder.css';

export function QuickOrderModal({ id, title, onClose }) {
  const { userProfile, isAuthenticated } = useContext(ShopContext);

  const [fastName, setFastName] = useState('');
  const [fastPhone, setFastPhone] = useState('+996 ');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      const fullName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
      setFastName(fullName || userProfile.username || '');
      
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

  // 🎯 СЕНЬОР-ФИКС: Эффект запуска локального салюта конфетти при успешном заказе
  useEffect(() => {
    if (!isSuccess) return;

    const duration = 2.0 * 1000; // 2 секунды салюта
    const animationEnd = Date.now() + duration;
    
    // Сузили углы, чтобы конфетти взрывалось аккуратно над областью модального окна
    const defaults = { startVelocity: 28, spread: 60, ticks: 70, zIndex: 99999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 35 * (timeLeft / duration);
      
      // Левая пушка
      confetti({ 
        ...defaults, 
        particleCount, 
        angle: 65, 
        origin: { x: randomInRange(0.38, 0.45), y: 0.6 } 
      });
      
      // Правая пушка
      confetti({ 
        ...defaults, 
        particleCount, 
        angle: 115, 
        origin: { x: randomInRange(0.55, 0.62), y: 0.6 } 
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isSuccess]);

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('+996')) {
      setFastPhone('+996 ');
      return;
    }
    if (value === '+996') {
      setFastPhone('+996 ');
      return;
    }
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
      if (!isAuthenticated) {
        setFastName('');
        setFastPhone('+996 ');
      }
    } catch (err) {
      console.error('Ошибка при отправке快速 заказа:', err);
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

  return createPortal(
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center quick-modal-overlay" 
      style={{ backgroundColor: 'rgba(44, 37, 32, 0.45)', zIndex: 9999, backdropFilter: 'blur(4px)' }} 
      onClick={() => !isSubmitting && onClose()}
    >
      <div 
        className="bg-white p-4 rounded-4 shadow-lg border quick-modal-card" 
        style={{ width: '100%', maxWidth: '380px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button"
          className="position-absolute border-0 bg-transparent fs-4 text-muted p-0 quick-modal-close-btn" 
          style={{ top: '10px', right: '15px', cursor: 'pointer', outline: 'none', zIndex: 10 }}
          onClick={onClose}
          disabled={isSubmitting}
        >
          &times;
        </button>

        {isSuccess ? (
          /* =========================================================================
             🎯 ТВОЙ ИТОГОВЫЙ UI-ЭФФЕКТ: Нежно-зеленый круг, галочка и кнопка фиксации
             ========================================================================= */
          <div className="text-center py-3">
            
            {/* Твой круг успеха и упругая галочка */}
            <div className="success-icon-wrapper-modal">
              <div className="success-checkmark-modal">✓</div>
            </div>

            <h4 className="fw-bold mb-2 text-dark">Заявка принята!</h4>
            <p className="text-muted small mb-4 px-2" style={{ lineHeight: '1.6' }}>
              Спасибо за доверие! Менеджер Огулов Центра свяжется с вами в течение 10 минут для подтверждения заказа.
            </p>

            <button 
              type="button" 
              className="quick-modal-close-success-btn w-100" 
              onClick={onClose}
            >
              Отлично, жду звонка
            </button>
          </div>
        ) : (
          /* =========================================================================
             СТАНДАРТНЫЙ ШАГ ВВОДА ДАННЫХ (Твоя исходная форма)
             ========================================================================= */
          <>
            <div className="text-center mb-3">
              <h5 className="fw-bold text-dark mb-1">Быстрый заказ</h5>
              <p className="text-muted small">Оставьте контактные данные, менеджер клиники перезвонит вам</p>
            </div>

            <div className="p-2 bg-light rounded text-center small mb-3 text-truncate fw-semibold border text-secondary" title={title}>
              📦 {title}
            </div>

            <form onSubmit={handleFastSubmit}>
              {apiError && <div className="alert alert-danger py-2 small rounded-2 mb-2">⚠️ {apiError}</div>}

              <div className="mb-2 text-start">
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

              <div className="mb-3 text-start">
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

              <button 
                type="submit" 
                className="btn btn-sm w-100 fw-bold py-2 text-white border-0 rounded-3 d-flex align-items-center justify-content-center shadow-sm" 
                style={{ backgroundColor: '#2c2520' }} 
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
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
