import React from 'react';
import { useShop } from './ShopContext'; 
import ShopProductCards from './ShopProductCards'; // Импортируем нашу сетку

export default function ShopCatalog() {
  // Сами вытаскиваем живой массив из Django-ядра
  const { productsData = [], isProductsLoading, productsError } = useShop();

  // 1. Обработка загрузки сети
  if (isProductsLoading) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2 text-muted">Синхронизация с базой данных клиники...</p>
      </div>
    );
  }

  // 2. Обработка ошибок бэкенда Django
  if (productsError) {
    return (
      <div className="container my-4">
        <div className="alert alert-warning text-center" role="alert">
          {productsError}
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold text-dark">Каталог продукции</h2>
      
      {/* 
        Передаем живой массив товаров в компонент сетки, 
        который ты только что отладил!
      */}
      {productsData && productsData.length > 0 ? (
        <ShopProductCards currentProducts={productsData} />
      ) : (
        <div className="text-center py-5 text-muted bg-white rounded shadow-sm my-4 border">
          <h5>Товары не найдены</h5>
          <p className="mb-0 small text-secondary">В данной категории еще нет загруженных товаров в Django.</p>
        </div>
      )}
    </div>
  );
}
