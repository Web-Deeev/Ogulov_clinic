import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// 🎯 СЕНЬОР-ФИКС: Чистая вертикальная анимация (вверх-вниз) без "зацепов" контента
const pageVariants = {
  initial: {
    opacity: 0,
    y: 12, // Новая страница плавно поднимается снизу
  },
  in: {
    opacity: 1,
    y: 0,  // Встает ровно на свое место
  },
  out: {
    opacity: 0,
    y: -12, // Старая страница мягко уходит наверх
  },
};

const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1], // Твой проверенный кубик-безье
  duration: 0.35, // Оптимальная скорость для мягкого восприятия
};

export const PageTransition = ({ children }) => {
  const { pathname } = useLocation();

  // Жестко сбрасываем скролл в ноль при каждом переходе
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ 
        width: '100%', 
        minHeight: '60vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }} 
    >
      {children}
    </motion.div>
  );
};
