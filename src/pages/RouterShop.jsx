// src/pages/RouterShop.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ShopProvider, ShopContext } from '../components/shop/ShopMainDetails/ShopContext.jsx';
import ShopPage from './shop/ShopPage.jsx';
import ShopProductsTab from '../components/shop/ShopProductsTab/ShopProductsTab.jsx';
import ShopProductPage from '../components/shop/ShopMainDetails/ShopProductPage.jsx';
import ShopCart from '../components/shop/ShopCart/ShopCart.jsx';
import ShopOrderSuccess from '../components/shop/ShopCart/ShopOrderSuccess.jsx';
import ShopCheckout from '../components/shop/ShopCart/ShopCheckout.jsx';
import ShopProfile from '../components/shop/ShopProfile/ShopProfile.jsx';
import ShopAuth from '../components/shop/ShopProfile/ShopAuth.jsx';

/* Подкомпоненты вкладок личного кабинета */
import OrderHistory from '../components/shop/ShopProfile/OrderHistory.jsx';
import ProfileInfo from '../components/shop/ShopProfile/ProfileInfo.jsx';
import ProfileFavorites from '../components/shop/ShopProfile/ProfileFavorites.jsx';
import ProfileAddress from '../components/shop/ShopProfile/ProfileAddress.jsx'; 

import ShopAbout from '../components/shop/ShopInfo/ShopAbout.jsx';
import ShopDelivery from '../components/shop/ShopInfo/ShopDelivery.jsx';
import ShopPayment from '../components/shop/ShopInfo/ShopPayment.jsx';
import ShopContacts from '../components/shop/ShopInfo/ShopContacts.jsx';

// ВНУТРЕННИЙ КОМПОНЕНТ ДЛЯ ЗАЩИТЫ ЗАКРЫТЫХ СТРАНИЦ
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isSessionLoading } = useContext(ShopContext);
  
  if (isSessionLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-white" style={{ minHeight: '400px', width: '100%' }}>
        <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Проверка сессии клиники...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/shop/auth" replace />;
  }
  return children;
};

export default function RouterShop() {
  return (
    <ShopProvider>
      <Routes>
        {/* 
          🎯 СЕНЬОР-ФИКС: Оборачиваем весь магазин в один базовый роут.
          Для HashRouter это гарантирует, что макет ShopPage смонтируется ОДИН раз.
          Переходы между категориями теперь будут затрагивать ТОЛЬКО `<Outlet />`!
        */}
        <Route path="/" element={<ShopPage />}>
          
          {/* Главная страница магазина (откроется по умолчанию) */}
          <Route index element={<ShopProductsTab />} />
          
          {/* Страница каталога и категорий (без префиксов слэшей, строго относительно!) */}
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
          <Route path="profile" element={<ProtectedRoute><ShopProfile /></ProtectedRoute>}>
            <Route index element={<OrderHistory />} /> 
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

          {/* Редирект на главную магазина, если путь не распознан */}
          <Route path="*" element={<Navigate to="" replace />} />
        </Route>
      </Routes>
    </ShopProvider>
  );
}
