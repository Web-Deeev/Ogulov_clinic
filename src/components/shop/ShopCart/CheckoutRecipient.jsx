import React from 'react';

export default function CheckoutRecipient({ formData, handleInputChange }) {
  return (
    <div className="p-4 bg-white rounded shadow-sm border mb-4">
      <h4 className="mb-4 fw-bold text-uppercase border-bottom pb-2 text-dark fs-5">
        <span className="text-warning me-2">1.</span> Данные получателя
      </h4>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label small fw-semibold text-muted mb-1">ФИО полностью *</label>
          <input 
            type="text" 
            name="customer_name" 
            className="form-control p-2 shadow-none" 
            placeholder="Например: Асанбеков Алмаз"
            required 
            value={formData.customer_name} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="col-12">
          <label className="form-label small fw-semibold text-muted mb-1">Телефон для связи *</label>
          <input 
            type="tel" 
            name="phone" 
            className="form-control p-2 shadow-none" 
            placeholder="+996 555 123 456" 
            required 
            value={formData.phone} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
    </div>
  );
}
