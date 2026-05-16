import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ShopProvider } from "./ShopContext";

// 1. Главный шаблон (Layout) модуля магазина
import ShopPage from "./ShopPage";

// 2. Страница витрины и деталка (Синхронизировано с твоими импортами)

import ShopProductPage from "./ShopProductPage";
import ShopProductsTab from "./ShopProductsTab";

// 3. Твои готовые инфо-страницы
import ShopAbout from "./ShopAbout";
import ShopPayment from "./ShopPayment";
import ShopDelivery from "./ShopDelivery";
import ShopContacts from "./ShopContacts";

// Импортируем страницу корзины (убедись, что имя файла ShopCart.jsx совпадает)
import ShopCart from "./ShopCart";
import ShopFavorites from "./ShopFavorites";

// Экспорт по умолчанию настроен правильно под имя твоего файла routerShop.jsx
export default function ShopRoutes() {
  return (
 <ShopProvider>
    <Routes>
      {/* Корневой роут магазина. Загружает рамку сайта (Шапку/Футер) */}
      <Route path="/" element={<ShopPage />}>
        
        {/* ИСПРАВЛЕНО: Вместо несуществующего Catalog ставим твою витрину с табами */}
        <Route index element={<ShopProductsTab />} />

        {/* Инфо-страницы */}
        <Route path="about" element={<ShopAbout />} />
        <Route path="payment" element={<ShopPayment />} />
        <Route path="delivery" element={<ShopDelivery />} />
        <Route path="contacts" element={<ShopContacts />} />

        {/* Подключаем твою реальную детальную страницу товара и корзину */}
        <Route path="product/:id" element={<ShopProductPage />} />
        <Route path="cart" element={<ShopCart />} />
        <Route path="wishlist" element={<ShopFavorites />} />
        {/* Заглушки для будущих динамических страниц */}
        <Route path="profile" element={<div className="container py-5"><h3>Личный кабинет</h3></div>} />
      </Route>

      {/* Если юзер ввел /shop/непонятную-ерунду, перенаправляем в корень магазина */}
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
    </ShopProvider>
  );
}
