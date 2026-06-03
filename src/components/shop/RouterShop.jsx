import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ShopProvider, ShopContext } from './ShopMainDetails/ShopContext.jsx';
import ShopPage from './ShopPage.jsx';
import ShopProductsTab from './ShopProductsTab/ShopProductsTab.jsx';
import ShopProductPage from './ShopMainDetails/ShopProductPage.jsx';
import ShopCart from './ShopCart/ShopCart.jsx';
import ShopOrderSuccess from './ShopCart/ShopOrderSuccess.jsx';
import ShopCheckout from './ShopCart/ShopCheckout.jsx';
import ShopProfile from './ShopProfile/ShopProfile.jsx';
import ShopAuth from './ShopProfile/ShopAuth.jsx';

/* Подкомпоненты вкладок личного кабинета */
import OrderHistory from './ShopProfile/OrderHistory.jsx';
import ProfileInfo from './ShopProfile/ProfileInfo.jsx';
import ProfileFavorites from './ShopProfile/ProfileFavorites.jsx';
import ProfileAddress from './ShopProfile/ProfileAddress.jsx'; 

import ShopAbout from './ShopInfo/ShopAbout.jsx';
import ShopDelivery from './ShopInfo/ShopDelivery.jsx';
import ShopPayment from './ShopInfo/ShopPayment.jsx';
import ShopContacts from './ShopInfo/ShopContacts.jsx';

// ВНУТРЕННИЙ КОМПОНЕНТ ДЛЯ ЗАЩИТЫ ЗАКРЫТЫХ СТРАНИЦ
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(ShopContext);
  
  // Перенаправляем на страницу входа внутри магазина
  if (!isAuthenticated) {
    return <Navigate to="/shop/auth" replace />;
  }
  return children;
};

export default function RouterShop() {
  return (
    <ShopProvider>
      <Routes>
        {/* 🎯 СЕНИОР-ФИКС: Меняем path="/" на path="/*", чтобы роутер хэша 
            корректно прокидывал ссылки из хедера внутрь корневой страницы магазина */}
        <Route path="/*" element={<ShopPage />}>
          
          {/* Витрина общего каталога */}
          <Route index element={<ShopProductsTab />} />
          <Route path="catalog" element={<ShopProductsTab />} />
          
          <Route path="catalog/:categorySlug" element={<ShopProductsTab />} />
          
          {/* Страница детального просмотра товара */}
          <Route path="product/:id" element={<ShopProductPage />} />
          
          {/* Корзина, Избранное и Оформление заказа */}
          <Route path="cart" element={<ShopCart />} />
          <Route path="checkout" element={<ShopCheckout />} />
          <Route path="order-success" element={<ShopOrderSuccess />} />
          <Route path="wishlist" element={<ProfileFavorites />} />

          {/* ВЛОЖЕННЫЙ РОУТИНГ ДЛЯ ЛИЧНОГО КАБИНЕТА */}
          <Route 
            path="profile/*" 
            element = {
              <ProtectedRoute>
                <ShopProfile />
              </ProtectedRoute>
            } 
          >
            {/* Вкладка по умолчанию */}
            <Route index element={<OrderHistory />} /> 
            
            {/* Относительные пути для вкладок личного кабинета */}
            <Route path="orders" element={<OrderHistory />} />
            <Route path="info" element={<ProfileInfo />} />
            <Route path="favorites" element={<ProfileFavorites />} />
            <Route path="addresses" element={<ProfileAddress />} />
          </Route>
          
          <Route path="auth" element={<ShopAuth />} />
         
          {/* Инфо-страницы */}
          <Route path="about" element={<ShopAbout />} />
          <Route path="delivery" element={<ShopDelivery />} />
          <Route path="payment" element={<ShopPayment />} />
          <Route path="contacts" element={<ShopContacts />} />

          {/* 🎯 СЕНИОР-ФИКС: Заменяем жесткий редирект на чистый Navigate to=""
              чтобы не зацикливать роутер на пустом слэше */}
          <Route path="*" element={<Navigate to="" replace />} />
        </Route>
      </Routes>
    </ShopProvider>
  );
}
