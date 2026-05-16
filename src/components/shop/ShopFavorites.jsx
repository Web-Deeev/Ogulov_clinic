import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from './ShopContext';
import ShopProductCards from './ShopProductCards';

export default function ShopWishlist() {
  // Достаем массив избранного и функции из глобального контекста
  const { favorites = [], addToCart, setFavorites } = useShop();

  // Логика удаления/добавления (переключения) сердечка на этой странице
  const toggleFavorite = (product) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== product.id));
  };

  // Если список желаний пуст
  if (favorites.length === 0) {
    return (
      <div className="container my-5 py-5 text-center bg-white rounded shadow-sm">
        <h2 className="mb-3 text-dark">Ваш список желаний пуст</h2>
        <p className="text-muted small">Добавляйте товары в избранное с помощью сердечек на карточках.</p>
        <Link to="/shop" className="btn btn-success mt-3 btn-ogulov">
          Вернуться на витрину
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="shop-breadcrumbs mb-4 small text-muted">
        <Link to="/shop" className="text-decoration-none text-success">Главная магазина</Link>
        <span className="mx-2">/</span>
        <span className="text-dark">Список желаний</span>
      </div>

      <h1 className="mb-4 fw-bold text-dark">Избранные товары</h1>

      {/* Сетка избранных товаров */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {favorites.map((product) => (
          <div key={product.id} className="col">
            <ShopProductCards
              product={product}
              onBuyClick={addToCart}
              onFavoriteClick={toggleFavorite}
              isFavorite={true} // На этой странице все товары гарантированно в избранном
            />
          </div>
        ))}
      </div>
    </div>
  );
}
