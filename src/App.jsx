import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Импорт роутера из папки pages без лишней вложенности
import RouterClinic from './pages/RouterClinic';
import RouterShop from './components/shop/RouterShop';

import './style.css';
import './pages/clinic/clinic.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Изолированный магазин */}
        <Route path="/shop/*" element={<RouterShop />} />
        
        {/* Все остальные медицинские пути */}
        <Route path="/*" element={<RouterClinic />} />
      </Routes>
    </Router>
  );
}

export default App;
