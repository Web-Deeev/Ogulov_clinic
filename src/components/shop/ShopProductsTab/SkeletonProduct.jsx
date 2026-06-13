// src/components/shop/ShopProductsTab/ShopProductSkeleton.jsx
import React from 'react';

export default function ShopProductSkeleton() {
  return (
    <div className="card h-100 border border-light-subtle shadow-sm p-3 style={{ minHeight: '380px' }}">
      {/* Имитация изображения товара */}
      <div className="placeholder-glow mb-3" style={{ height: '180px', width: '100%' }}>
        <div className="placeholder col-12 rounded-3 bg-secondary-subtle h-100"></div>
      </div>
      
      {/* Имитация заголовка */}
      <div className="card-body p-0 d-flex flex-column justify-content-between">
        <div className="placeholder-glow mb-2">
          <span className="placeholder col-8 bg-secondary-subtle rounded"></span>
          <span className="placeholder col-4 bg-secondary-subtle rounded mt-1"></span>
        </div>
        
        {/* Имитация цены и кнопки */}
        <div className="d-flex justify-content-between align-items-center mt-3 placeholder-glow">
          <span className="placeholder col-4 bg-success-subtle rounded" style={{ height: '20px' }}></span>
          <span className="placeholder col-5 bg-dark-subtle rounded" style={{ height: '35px' }}></span>
        </div>
      </div>
    </div>
  );
}
