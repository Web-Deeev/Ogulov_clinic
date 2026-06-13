import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FAQ.css'; 

export default function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`faq-modern-card ${isOpen ? 'faq-modern-card--open' : ''}`}>
      
      {/* Шапка карточки клиники */}
      <div className="faq-modern-card__header" onClick={onToggle}>
        <h3 className="faq-modern-card__question">{question}</h3>
        
        {/* Круглая капсула-подложка для стрелочки */}
        <div className="faq-modern-card__arrow-wrapper">
          {/* 
            🎯 СЕНЬОР-ФИКС: Передаем управление вращением во framer-motion.
            По умолчанию у тебя в CSS было -90deg, при открытии 90deg.
            Framer Motion сделает этот переход идеально плавным.
          */}
          <motion.span 
            className="faq-modern-card__arrow"
            animate={{ rotate: isOpen ? 90 : -90 }} 
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: 'inline-block' }}
          >
            ‹
          </motion.span>
        </div>
      </div>

      {/* 🎯 СЕНЬОР-ФИКС: Высокопроизводительное раскрытие панели через Framer Motion */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }} // Твой кубик-безье
            className="faq-modern-card__body-wrapper"
          >
            <div className="faq-modern-card__body-content">
              <p className="faq-modern-card__answer">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
