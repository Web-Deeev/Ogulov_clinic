// src/components/shop/ShopHome/ShopHome.jsx
import React, { memo } from 'react';
import { useShop } from '../ShopMainDetails/ShopContext.jsx'; // Подтягиваем твой контекст магазина

import ShopTopBar from './ShopTopBar';
import ShopBanner from './ShopBanner';
import ShopSearchDropdown from './ShopSearchDropdown';

import './shopMainDetails.css'; 

const ShopHome = memo(function ShopHome() {
  // Достаем из твоего контекста данные пользователя и список избранного
  // (Защищаем фронт дефолтными значениями на случай, если юзер — аноним)
  const { 
    userCity = 'Бишкек',        // Динамический город из профиля или GeoIP
    favorites = [],            // Массив ID товаров в избранном
    isAuthenticated = false    // Флаг авторизации для личного кабинета
  } = useShop();

  return (
    <div className="shop-home-view">
      {/* 
        Передаем в TopBar реальные динамические метрики.
        Теперь TopBar сам перерисует счетчик избранного или имя пользователя,
        а тяжелый баннер ниже останется неподвижным благодаря React.memo.
      */}
      <ShopTopBar 
        city={userCity} 
        favoritesCount={favorites.length} 
        isLogged={isAuthenticated}
      />

      {/* Поисковый блок с дебаунсом */}
      <div className="container my-3">
        <ShopSearchDropdown />
      </div>

      {/* Главный рекламный баннер магазина медицинской клиники */}
      <ShopBanner />
    </div>
  );
});

export default ShopHome;
