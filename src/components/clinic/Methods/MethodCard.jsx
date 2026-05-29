import React from 'react';

export default function MethodCard({ method }) {
  return (
    <div className="method-card">
      <img src={method.image} alt={method.title} className="method-card__img" />
      <h3 className="method-card__title">{method.title}</h3>
      <p className="method-card__desc">{method.desc}</p>
    </div>
  );
}