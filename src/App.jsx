import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClinicLayout from './pages/clinic/ClinicLayout';
import ClinicAbout from './pages/clinic/ClinicAbout';
import ClinicDoctors from './pages/clinic/ClinicDoctors';
import ClinicMethods from './pages/clinic/ClinicMethods';
import ClinicPrices from './pages/clinic/ClinicPrices';
import ClinicAwards from './pages/clinic/ClinicAwards';
import ClinicFAQ from './pages/clinic/ClinicFAQ';
import ClinicContacts from './pages/clinic/ClinicContacts';
import PersonalPage from './components/clinic/Doctors/PersonalPage';



import './style.css';
import './pages/clinic/clinic.css';

// Наш единый диспетчер путей магазина
import RouterShop from './components/shop/RouterShop';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClinicAbout />} />
        <Route path="/shop/*" element={<RouterShop />} />
        <Route path="/clinic">
          <Route path="about" element={<ClinicAbout />} />
          <Route path="doctors" element={<ClinicDoctors />} />
          
           <Route path="doctors/:id" element={<PersonalPage />} />
          
          <Route path="methods" element={<ClinicMethods />} />
          <Route path="awards" element={<ClinicAwards />} />
          <Route path="faq" element={<ClinicFAQ />} />
          <Route path="contacts" element={<ClinicContacts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
