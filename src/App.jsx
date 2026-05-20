import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import ClinicLayout from './pages/clinic/ClinicLayout';
import ClinicAbout from './pages/clinic/ClinicAbout';
import ClinicDoctors from './pages/clinic/ClinicDoctors';
import ClinicMethods from './pages/clinic/ClinicMethods';
import ClinicPrices from './pages/clinic/ClinicPrices';
import ClinicAwards from './pages/clinic/ClinicAwards';
import ClinicFAQ from './pages/clinic/ClinicFAQ';
import ClinicContacts from './pages/clinic/ClinicContacts';
import './style.css';
import './pages/clinic/clinic.css';

// Наш единый диспетчер путей магазина
import RouterShop from './components/shop/RouterShop';

function App() {
  return (
    <Router>
      {/* Главная ОБЩАЯ шапка для всего сайта (Клиника, Академия, Магазин) */}
      <Header />

      <Routes>
        {/* Главная страница лендинга клиники */}
        <Route path="/" element={<HomePage />} />
        
        {/* Интернет-магазин (Внутренние пути, включая кабинет /shop/profile) */}
        <Route path="/shop/*" element={<RouterShop />} />

        {/* Раздел Клиника */}
        <Route path="/clinic" element={<ClinicLayout />}>
          <Route index element={<ClinicAbout />} />
          <Route path="about" element={<ClinicAbout />} />
          <Route path="doctors" element={<ClinicDoctors />} />
          <Route path="methods" element={<ClinicMethods />} />
          <Route path="prices" element={<ClinicPrices />} />
          <Route path="awards" element={<ClinicAwards />} />
          <Route path="faq" element={<ClinicFAQ />} />
          <Route path="contacts" element={<ClinicContacts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
