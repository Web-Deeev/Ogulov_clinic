import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // Подключаем анимации

// Импорт роутеров клиники и магазина
import RouterClinic from './pages/RouterClinic';
import RouterShop from './pages/RouterShop';

import './style.css';
import './pages/clinic/clinic.css';

// 🎯 СЕНЬОР-ФИКС: Выносим роуты в отдельный компонент, чтобы работал хук useLocation
function AnimatedRoutes() {
  const location = useLocation();

   const getAnimateKey = (pathname) => {
    if (pathname && pathname.startsWith('/shop')) {
      return '/shop';
    }
    return pathname; // Для остальных медицинских разделов оставляем стандартную изоляцию страниц
  };

  return (
    <AnimatePresence mode="wait">
      {/* 🎯 СЕНЬОР-ФИКС: Скорректировали генерацию ключа */}
      <Routes location={location} key={getAnimateKey(location.pathname)}>
        {/* Изолированный магазин */}
        <Route path="/shop/*" element={<RouterShop />} />
        
        {/* Все остальные медицинские пути */}
        <Route path="/*" element={<RouterClinic />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
