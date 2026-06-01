import React from 'react';
import PropTypes from 'prop-types';

export default function AwardTabs({ activeTab, onChangeTab }) {
  return (
    <div className="clinic-awards__tabs">
      <button 
        className={`clinic-awards__tab-btn ${activeTab === 'diploma' ? 'clinic-awards__tab-btn--active' : ''}`}
        onClick={() => onChangeTab('diploma')}
      >
        Дипломы
      </button>
      <button 
        className={`clinic-awards__tab-btn ${activeTab === 'gratitude' ? 'clinic-awards__tab-btn--active' : ''}`}
        onClick={() => onChangeTab('gratitude')}
      >
        Сертификаты
      </button>
    </div>
  );
}

AwardTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onChangeTab: PropTypes.func.isRequired,
};
