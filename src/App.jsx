import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ShopCategoryPage from './pages/ShopCategoryPage'
import Header from './components/Header'
import ClinicAbout from './pages/clinic/ClinicAbout';
import ClinicDoctors from './pages/clinic/ClinicDoctors';
import ClinicMethods from './pages/clinic/ClinicMethods';
import ClinicPrices from './pages/clinic/ClinicPrices';
import ClinicAwards from './pages/clinic/ClinicAwards';
import ClinicFAQ from './pages/clinic/ClinicFAQ';
import ClinicContacts from './pages/clinic/ClinicContacts';
import './style.css'
import './pages/clinic/clinic.css'


function App() {
  return (
    <BrowserRouter>

      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/category" element={<ShopCategoryPage />} />
      
            {/* Клиника */}
        <Route path="/" element={<ClinicAbout />} />
        <Route path="/clinic/about" element={<ClinicAbout />} />
        <Route path="/clinic/doctors" element={<ClinicDoctors />} />
        <Route path="/clinic/methods" element={<ClinicMethods />} />
        <Route path="/clinic/prices" element={<ClinicPrices />} />
        <Route path="/clinic/awards" element={<ClinicAwards />} />
        <Route path="/clinic/faq" element={<ClinicFAQ />} />
        <Route path="/clinic/contacts" element={<ClinicContacts />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App