import React from 'react';

export default function Tabs({ branches, activeBranch, onSelect }) {
  return (
    <div className="contacts-tabs">
      {Object.keys(branches).map((key) => (
        <button 
          key={key}
          type="button"
          className={`contacts-tab-btn ${activeBranch === key ? 'contacts-tab-btn--active' : ''}`}
          onClick={() => onSelect(key)}
        >
          {branches[key].title}
        </button>
      ))}
    </div>
  );
}
