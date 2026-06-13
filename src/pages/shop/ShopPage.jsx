// src/pages/shop/ShopPage.jsx
import React from "react";
import { Outlet } from "react-router-dom"; 

// 1. Главный хедер всей клиники (поднимаемся на 2 уровня в src/ и заходим в components)
import Header from '../../components/common/Header/clinic/Header';

// 2. Хедер магазина (берем его из его РЕАЛЬНОГО места в структуре)
import { ShopHeader } from "../../components/common/Header/shop/ShopHeader.jsx"; 

// 3. Подвал магазина (поднимаемся в src/ и заходим в components/common/Footer/shop)
import ShopFooter from "../../components/common/Footer/shop/ShopFooter.jsx";     

// 4. Стили проекта (выходим в корень src/)
import '../../style.css';
import '../../components/shop/shop.css';

export default function ShopPage() {
  return (
    <div className="shop-page">
      {/* Глобальная шапка клиники */}
      <Header />
      
      {/* Главная шапка магазина (содержит TopBar, поиск и категории) */}
      <ShopHeader />

      {/* Центральный контент, куда React Router подставит страницы */}
      <main className="shop-content-wrapper">
        <Outlet />
      </main>

      {/* Подвал магазина */}
      <ShopFooter />
    </div>
  );
}
