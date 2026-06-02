import React, { useEffect, useState } from 'react';
import Slider from '../ui/Slider.jsx'; 
import MethodCard from '../Methods/MethodCard.jsx'; 
import { clinicApi } from '@/api/clinic/clinic';

/**
 * Модульный компонент секции методик.
 * Полностью инкапсулирует логику запроса к бэкенду.
 */
export default function MethodsSection() {
  const [methods, setMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    clinicApi.getMethods()
      .then((data) => {
        const result = data?.data ? data.data : data;
        if (Array.isArray(result)) {
          setMethods(result);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('❌ Ошибка загрузки методик в секции:', err);
        setIsLoading(false);
      });
  }, []);

  // KISS: если данные еще грузятся или база пуста — компонент ничего не рендерит
  if (isLoading || methods.length === 0) return null;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <Slider 
        items={methods}
        title="Наши методики"
        scrollStep={340}
        viewAllLink="/methods"
        viewAllText="Просмотреть все методики"
        renderItem={(method) => (
          <MethodCard key={method.id} method={method} />
        )}
      />
    </div>
  );
}
