// src/components/shop/ShopTopBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../shop/ShopMainDetails/ShopContext';

export default function ShopTopBar({ city = 'Бишкек' }) {
  const { favorites = [] } = useShop();

  return (
    <div className="shop-topbar">
      <div className="container shop-topbar-inner">
        <div>Ваш город: {city}</div>
        <div className="shop-topbar-right">
          <Link to="/shop/wishlist" style={{ textDecoration: 'none', color: 'inherit' }}>
            Список желаний ({favorites.length})
          </Link>
          <Link to="/shop/profile" style={{ marginLeft: '15px', textDecoration: 'none', color: 'inherit' }}>
            Личный кабинет
          </Link>
        </div>
      </div>
    </div>
  );
}
