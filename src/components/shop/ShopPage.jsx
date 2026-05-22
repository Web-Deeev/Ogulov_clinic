import React from "react";
import { Outlet } from "react-router-dom"; 

import Header from '../../components/common/Header/Header'
import { useShop } from "./ShopMainDetails/ShopContext"; 
import { ShopHeader } from "./ShopHeader/ShopHeader.jsx"; 
import ShopFooter from "./ShopFooter.jsx";     
import ShopTopBar from "./ShopHeader/ShopTopBar.jsx"; 

import '../../style.css';
import './shop.css';

export default function ShopPage() {
  return (
    
          
    <div className="shop-page">
      <Header />
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
