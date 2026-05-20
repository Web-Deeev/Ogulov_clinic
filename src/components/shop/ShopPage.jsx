import React from "react";
import { Outlet } from "react-router-dom"; 
// Хук импортируется правильно
import { useShop } from "./ShopMainDetails/ShopContext"; 

// ИСПРАВЛЕНО: Шапка и Подвал лежат в той же папке, что и этот файл. Импортируем их как default-компоненты
import { ShopHeader } from "./ShopHeader.jsx"; 
import ShopFooter from "./ShopFooter.jsx";     

// ИСПРАВЛЕНО: Топ-бар лежит внутри подпапки ShopHeader/ShopTopBar.jsx
import ShopTopBar from "./ShopHeader/ShopTopBar.jsx"; 

import '../../style.css';
import './shop.css';

export default function ShopPage() {
  return (
    <div className="shop-page">
      {/* Верхняя черная/серая плашка сайта */}
      <ShopTopBar />
      
      {/* Главная шапка магазина (логотип, поиск, корзина) */}
      <ShopHeader />

      {/* Центральная часть, куда React Router подставляет контент */}
      <main className="shop-content-wrapper">
        <Outlet />
      </main>

      {/* Подвал магазина */}
      <ShopFooter />
    </div>
  );
}
