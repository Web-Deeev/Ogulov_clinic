import React from 'react';
import { Link } from 'react-router-dom';
// Используем твой официальный кастомный хук useShop
import { useShop } from '../ShopMainDetails/ShopContext.jsx';
// ИМПОРТИРУЕМ ФУНКЦИЮ ПО ЕЁ РЕАЛЬНОМУ ИМЕНИ ИЗ ФАЙЛА
import ProductCard from '../ShopMainDetails/ShopProductCards.jsx';

export default function ShopFavorites() {
  // Достаем массив избранного, корзину и метод переключения из твоего хука
  const { favorites = [], addToCart, toggleFavorite } = useShop();

  // Если список желаний пуст, показываем красивую заглушку
  if (favorites.length === 0) {
    return (
      <div className="container my-5 py-5 text-center bg-white rounded shadow-sm border border-light-subtle">
        <div className="mb-3" style={{ fontSize: '3.5rem' }}>❤️</div>
        <h2 className="mb-2 text-dark fw-bold">Ваш список желаний пуст</h2>
        <p className="text-muted small mb-4">Вы пока не добавили ни одного товара в избранное.</p>
        <Link 
          to="/shop" 
          className="btn btn-warning fw-bold px-4 py-2 text-dark shadow-sm" 
          style={{ backgroundColor: '#ffc107', borderColor: '#ffc107' }}
        >
          Вернуться на витрину
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Хлебные крошки */}
      <div className="shop-breadcrumbs mb-4 small text-muted">
        <Link to="/shop" className="text-decoration-none text-secondary">Главная магазина</Link>
        <span className="mx-2">/</span>
        <span className="text-dark fw-medium">Список желаний</span>
      </div>

      {/* Заголовок с динамическим счетчиком */}
      <h1 className="mb-4 fw-bold text-dark">Список желаний ({favorites.length})</h1>

      {/* Сетка избранных товаров */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {favorites.map((product) => {
          // Защита: если объект товара поврежден в localStorage, пропускаем его
          if (!product || !product.id) return null;
          
          return (
            <div key={product.id} className="col">
              {/* Вызываем компонент по его настоящему имени функции */}
              <ProductCard
                product={product}
                onBuyClick={addToCart}
                onFavoriteClick={() => toggleFavorite(product)}
                isFavorite={true} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}