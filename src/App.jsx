import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ИСПРАВЛЕНО: Правильный путь к Header от корня src/
import Header from './components/common/Header/Header'; 

import ClinicLayout from './pages/clinic/ClinicLayout';
import ClinicAbout from './pages/clinic/ClinicAbout';
import ClinicDoctors from './pages/clinic/ClinicDoctors';
import ClinicMethods from './pages/clinic/ClinicMethods';
import ClinicPrices from './pages/clinic/ClinicPrices';
import ClinicAwards from './pages/clinic/ClinicAwards';
import ClinicFAQ from './pages/clinic/ClinicFAQ';
import ClinicContacts from './pages/clinic/ClinicContacts';
import PersonalPage from './components/clinic/Doctors/PersonalPage';
import MethodCardPage from './components/clinic/Methods/CardPage';

import './style.css';
import './pages/clinic/clinic.css';

// Единый диспетчер путей магазина
import RouterShop from './components/shop/RouterShop';

function App() {
  return (
    <Router>
      <Routes>
        {/* Главная страница клиники */}
        <Route path="/" element={<ClinicAbout />} />
        
        {/* Роуты интернет-магазина */}
        <Route path="/shop/*" element={<RouterShop />} />
        
        {/* МНОГОСТРАНИЧНАЯ СИСТЕМЫ КЛИНИКИ */}
        <Route path="/clinic">
          <Route path="about" element={<ClinicAbout />} />
          
          {/* 1. Врачи */}
          <Route path="doctors" element={<ClinicDoctors />} />
          <Route path="doctors/:id" element={<PersonalPage />} />

          {/* 2. Методики оздоровления */}
          <Route path="methods" element={<ClinicMethods />} />
          <Route path="methods/:id" element={<MethodCardPage />} />
       
          {/* 3. Дополнительные страницы */}
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
