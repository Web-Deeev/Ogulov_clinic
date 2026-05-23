import React from 'react';

export default function CheckoutDelivery({ 
  deliveryType, 
  formData, 
  handleTypeTabChange, 
  handleInputChange,
  // НОВЫЕ ПРОПСЫ: Массив сохраненных адресов и функция для быстрой подстановки в стейт
  savedAddresses = [],
  onSelectSavedAddress
}) {
  return (
    <div className="p-4 bg-white rounded shadow-sm border">
      <h4 className="mb-4 fw-bold text-uppercase border-bottom pb-2 text-dark fs-5">
        <span className="text-warning me-2">2.</span> Способ получения
      </h4>
      
      {/* Табы */}
      <div className="row g-2 mb-4">
        <div className="col-6">
          <button
            type="button"
            className={`btn w-100 py-3 fw-bold border text-uppercase shadow-none ${deliveryType === 'DELIVERY' ? 'btn-dark text-white border-dark shadow-sm' : 'btn-light text-muted bg-white'}`}
            style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}
            onClick={() => handleTypeTabChange('DELIVERY')}
          >
            🚚 Доставка
          </button>
        </div>
        <div className="col-6">
          <button
            type="button"
            className={`btn w-100 py-3 fw-bold border text-uppercase shadow-none ${deliveryType === 'PICKUP' ? 'btn-dark text-white border-dark shadow-sm' : 'btn-light text-muted bg-white'}`}
            style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}
            onClick={() => handleTypeTabChange('PICKUP')}
          >
            🏢 Самовывоз
          </button>
        </div>
      </div>

      <div className="row g-3">
        {/* Методы курьер/СДЭК */}
        {deliveryType === 'DELIVERY' && (
          <div className="col-12 animate-fade-in">
            <label className="form-label small fw-semibold text-muted mb-1">Варианты доставки</label>
            <select 
              name="delivery_method" 
              className="form-select p-2 shadow-none" 
              value={formData.delivery_method} 
              onChange={handleInputChange}
            >
              <option value="BISHKEK">Курьерская доставка по Бишкеку (+200 сом)</option>
              <option value="CDEK">Регионы Кыргызстана / СНГ через СДЭК (+400 сом)</option>
            </select>
          </div>
        )}

        {/* НОВЫЙ БЛОК: Выбор из сохранённых адресов Личного кабинета */}
        {deliveryType === 'DELIVERY' && savedAddresses.length > 0 && (
          <div className="col-12 animate-fade-in">
            <label className="form-label small fw-semibold text-success mb-1">
              📋 Выберите из сохранённых адресов:
            </label>
            <div className="d-flex flex-wrap gap-2 pt-1">
              {savedAddresses.map((addr, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="btn btn-sm btn-outline-success text-start text-truncate rounded-2 fw-medium px-2.5 py-1.5"
                  style={{ maxWidth: '100%', fontSize: '0.8rem', borderStyle: 'dashed' }}
                  onClick={() => onSelectSavedAddress && onSelectSavedAddress(addr)}
                >
                  📍 {addr}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="col-12">
          <label className="form-label small fw-semibold text-muted mb-1">
            {deliveryType === 'PICKUP' ? 'Адрес пункта выдачи' : 'Адрес доставки *'}
          </label>
          <textarea 
            name="delivery_address" 
            className="form-control shadow-none" 
            rows="3" 
            readOnly={deliveryType === 'PICKUP'}
            placeholder={
              formData.delivery_method === 'BISHKEK' 
                ? "Укажите улицу, номер дома, номер квартиры в Бишкеке" 
                : "Укажите ваш город (например, Ош), точный адрес или код пункта выдачи СДЭК"
            }
            required 
            value={formData.delivery_address} 
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="col-12">
          <label className="form-label small fw-semibold text-muted mb-1">Комментарий к заказу</label>
          <textarea 
            name="comment" 
            className="form-control shadow-none" 
            rows="2" 
            placeholder={deliveryType === 'PICKUP' ? "Укажите желаемую дату и время, когда заберете заказ..." : "Пожелания по времени курьера, особенности проезда..."} 
            value={formData.comment} 
            onChange={handleInputChange}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
