import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../ShopMainDetails/ShopContext.jsx';
import ShopProductCards from '../ShopMainDetails/ShopProductCards.jsx'; 

export default function ProfileFavorites() {
  const { favorites = [], addToCart, setFavorites } = useContext(ShopContext);

  const toggleFavoriteInProfile = (product) => {
    if (setFavorites) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== product.id));
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <span style={{ fontSize: '3rem' }}>🤍</span>
        <h5 className="mt-3 fw-bold text-dark">Ваш список желаний пуст</h5>
        <Link to="/shop" className="btn btn-sm btn-warning fw-semibold px-4 py-2 text-dark mt-2">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold text-dark mb-4">Отложенные товары ({favorites.length})</h4>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        {favorites.map((product) => (
          <div className="col" key={product.id}>
            <ShopProductCards 
              product={product} 
              addToCart={addToCart}
              isFavorite={true}
              onToggleFavorite={() => toggleFavoriteInProfile(product)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}