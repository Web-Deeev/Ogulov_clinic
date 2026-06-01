import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './BookingModal.css'; // Чистый импорт изолированных стилей

export default function BookingModal({ isOpen, onClose, targetName, targetId, apiEndpoint }) {
  const dialogRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', phone: '', comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Очищаем от маски, оставляем только цифры для валидации длины
    const cleanPhone = formData.phone.replace(/\D/g, '');
    
    // КЫРГЫЗСТАН ФИКС: Номер с кодом 996 должен содержать ровно 12 цифр
    if (cleanPhone.length !== 12) {
      alert('Пожалуйста, введите корректный номер телефона (12 цифр, включая 996)');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await apiEndpoint({
        name: formData.name,
        phone: cleanPhone, // Отправляем на бэкенд Django чистую строку из 12 цифр
        comment: formData.comment,
        target_id: targetId,
        target_type: targetName
      });
      if (response.status === 201 || response.status === 200) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', comment: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog 
      ref={dialogRef} 
      onCancel={(e) => { e.preventDefault(); onClose(); }} 
      className="booking-modal-dialog"
    >
      <div className="booking-modal-header">
        <h3 className="booking-modal-title">Запись на консультацию</h3>
        <button 
          type="button" 
          onClick={onClose} 
          className="booking-modal-close-btn"
        >
          &times;
        </button>
      </div>

      {submitStatus === 'success' ? (
        <div className="booking-modal-success-screen">
          <div className="booking-modal-success-icon">✓</div>
          <h4 className="booking-modal-title" style={{ fontSize: '18px' }}>Заявка успешно принята!</h4>
          <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center' }}>
            Наш администратор свяжется с вами в течение 15 минут.
          </p>
          <button 
            type="button" 
            onClick={onClose} 
            className="booking-modal-submit-btn"
            style={{ backgroundColor: '#f1f5f9', color: '#334155', marginTop: '16px' }}
          >
            Закрыть окно
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p className="booking-modal-target-badge">
            Вы записываетесь на: <strong style={{ color: '#0f172a' }}>{targetName}</strong>
          </p>
          
          <div className="booking-modal-form-group">
            <label htmlFor="modal-name">Ваше имя *</label>
            <input 
              id="modal-name" 
              type="text" 
              required 
              disabled={isSubmitting} 
              value={formData.name} 
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
              placeholder="Иванов Иван" 
              className="booking-modal-input" 
            />
          </div>

          <div className="booking-modal-form-group">
            <label htmlFor="modal-phone">Телефон *</label>
            <input 
              id="modal-phone" 
              type="tel" 
              required 
              disabled={isSubmitting} 
              value={formData.phone} 
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} 
              placeholder="996 555 123 456" // ИСПРАВЛЕНО ПОД КЫРГЫЗСТАН
              className="booking-modal-input" 
            />
          </div>

          <div className="booking-modal-form-group">
            <label htmlFor="modal-comment">Комментарий</label>
            <textarea 
              id="modal-comment" 
              rows="3" 
              disabled={isSubmitting} 
              value={formData.comment} 
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))} 
              placeholder="Укажите удобное время для звонка..." 
              className="booking-modal-input" 
              style={{ resize: 'none' }}
            />
          </div>

          {submitStatus === 'error' && (
            <p className="booking-modal-error-message">
              Ошибка сервера. Пожалуйста, попробуйте позже.
            </p>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="booking-modal-submit-btn"
          >
            {isSubmitting ? 'Отправка...' : 'Записаться на приём'}
          </button>
        </form>
      )}
    </dialog>
  );
}

BookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  targetName: PropTypes.string.isRequired,
  targetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  apiEndpoint: PropTypes.func.isRequired
};
