import React from 'react';
import { Map, Marker } from 'pigeon-maps';

// Точные гео-координаты филиалов клиники в Бишкеке [широта, долгота]
const BRANCH_COORDINATES = {
  // Улица Исанова, д. 42/1 (Центр)
  vostok: [42.878951, 74.590136],
  
  // Микрорайон Джал-23, д. 59 (Магистраль)
  zapad: [42.841512, 74.564756]
};

// 🎯 ДОБАВИЛИ ПРОПС height СО ЗНАЧЕНИЕМ ПО УМОЛЧАНИЮ 450
export default function TwoGisMap({ activeBranch, height = 450 }) {
  // Извлекаем координаты или берем дефолтный Восток
  const currentCoords = BRANCH_COORDINATES[activeBranch] || BRANCH_COORDINATES.vostok;

  return (
    /* 🎯 ФИКС: Убрали класс h-[450px] и передаем высоту динамически через style */
    <div 
      className="w-full rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-50"
      style={{ height: `${height}px` }} 
    >
      <Map 
        height={height} // 🎯 Передаем высоту внутрь холста библиотеки pigeon-maps
        center={currentCoords} 
        defaultZoom={16}
        metaWheelZoom={false} // Защита: карта не будет зумиться случайно при скролле страницы
      >
        {/* Кастомный медицинский маркер изумрудного цвета клиники */}
        <Marker 
          width={40}
          anchor={currentCoords} 
          color="#059669" 
        />
      </Map>
    </div>
  );
}