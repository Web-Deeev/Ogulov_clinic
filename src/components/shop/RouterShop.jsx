import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ShopProvider } from './ShopMainDetails/ShopContext.jsx';
import ShopPage from './ShopPage.jsx';
import ShopProductsTab from './ShopProductsTab/ShopProductsTab.jsx';
import ShopProductPage from './ShopMainDetails/ShopProductPage.jsx';
import ShopCart from './ShopCart/ShopCart.jsx';
import ShopOrderSuccess from './ShopCart/ShopOrderSuccess.jsx';
import ShopCheckout from './ShopCart/ShopCheckout.jsx';
import ShopProfile from './ShopProfile/ShopProfile.jsx';
import ShopAuth from './ShopProfile/ShopAuth.jsx';
import ShopFavorites from './ShopCart/ShopFavorites.jsx';

import ShopAbout from './ShopInfo/ShopAbout.jsx';
import ShopDelivery from './ShopInfo/ShopDelivery.jsx';
import ShopPayment from './ShopInfo/ShopPayment.jsx';
import ShopContacts from './ShopInfo/ShopContacts.jsx';

export default function RouterShop() {
  return (
    <ShopProvider>
      <Routes>
        {/* Главная обертка всего магазина */}
        <Route path="/" element={<ShopPage />}>
          
          {/* Главная страница (Витрина каталога) */}
          <Route index element={<ShopProductsTab />} />
          <Route path="catalog" element={<ShopProductsTab />} />
          
          {/* Детальная страница товара */}
          <Route path="product/:id" element={<ShopProductPage />} />
          
          {/* Корзина, Избранное и Оформление заказа */}
          <Route path="cart" element={<ShopCart />} />
          <Route path="checkout" element={<ShopCheckout />} />
          <Route path="order-success" element={<ShopOrderSuccess />} />
          <Route path="wishlist" element={<ShopFavorites />} />

          {/* Авторизация и Личный кабинет */}
          <Route path="profile" element={<ShopProfile />} />
          
          <Route path="auth" element={<ShopAuth />} />
         
          {/* Инфо-страницы */}
          <Route path="about" element={<ShopAbout />} />
          <Route path="delivery" element={<ShopDelivery />} />
          <Route path="payment" element={<ShopPayment />} />
          <Route path="contacts" element={<ShopContacts />} />

          {/* Защита от ввода несуществующих URL — редирект на витрину */}
          <Route path="*" element={<Navigate to="" replace />} />
        </Route>
      </Routes>
    </ShopProvider>
  );
}
