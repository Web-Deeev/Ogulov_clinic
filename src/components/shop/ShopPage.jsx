import React from "react";
import { Outlet } from "react-router-dom"; 
import { ShopProvider } from "./ShopContext"; // Импортируем провайдер
import { ShopHeader, ShopTopBar } from "./ShopHeader"; 
import ShopFooter from "./ShopFooter";     


import '../../style.css';
import './shop.css';

export default function ShopPage() {
  return (
    // Оборачиваем весь магазин в контекст. Теперь пропсы не нужны!
    <ShopProvider>
      <div className="shop-page">
        
        <ShopTopBar />
        
        <ShopHeader />

        <main className="shop-content-wrapper">
        
          <Outlet />
        </main>

        <ShopFooter />
      </div>
    </ShopProvider>
  );
}


