import React from 'react';
import MethodCard from '../../components/clinic/Methods/MethodCard';

const methodsData = [
  { id: 1, title: 'Висцеральный массаж', desc: 'Массаж органов через брюшную стенку.', image: '/images/methods/visc.jpg' },
  { id: 2, title: 'Вакуумные банки', desc: 'Постановка банок для улучшения кровотока.', image: '/images/methods/banks.jpg' }
];

export default function ClinicMethods() {
  return (
    <div className="container clinic-methods-page">
      <h1 className="page-title">Методики оздоровления</h1>
      <div className="methods-grid">
        {methodsData.map(method => <MethodCard key={method.id} method={method} />)}
      </div>
    </div>
  );
}