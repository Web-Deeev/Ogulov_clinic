import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage';
import ShopPage from './components/shop/ShopPage';
import ShopCategoryPage from './components/shop/ShopCategoryPage';
import Header from './components/Header';
import ClinicLayout from './pages/clinic/ClinicLayout';
import ClinicAbout from './pages/clinic/ClinicAbout';
import ClinicDoctors from './pages/clinic/ClinicDoctors';
import ClinicMethods from './pages/clinic/ClinicMethods';
import ClinicPrices from './pages/clinic/ClinicPrices';
import ClinicAwards from './pages/clinic/ClinicAwards';
import ClinicFAQ from './pages/clinic/ClinicFAQ';
import ClinicContacts from './pages/clinic/ClinicContacts';
import './style.css'
import './pages/clinic/clinic.css'

import RouterShop from './components/shop/RouterShop';


function App() {
  return (
    <Router>

      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        
        
      
        {/* Интернет-магазин */}

        <Route path="/shop/*" element={<RouterShop />} />


            {/* Клиника */}
           
        <Route path="/clinic" element={<ClinicLayout />}>
         
          <Route index element={<ClinicAbout />} /> {/* Это откроется по ссылке /clinic */}
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
  )
}

export default App