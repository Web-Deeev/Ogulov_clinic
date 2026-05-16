import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Создаем сам контекст
const ShopContext = createContext();

// 2. Создаем Провайдер, который будет хранить все стейты
export function ShopProvider({ children }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Инициализация корзины из localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('ogulov_shop_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Инициализация списка желаний из localStorage (Дубли удалены)
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('ogulov_shop_favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  // Единый источник правды для категорий (ID совпадают с твоим файлом shopData.js)
  const menuItems = [
    { title: 'Книги', id: 'books' }, 
    { title: 'Плакаты Огулова А.Т.', id: 'posters' },
    { title: 'Устройство очистки ПВВК', id: 'equipment' },
    { title: 'Пищевые добавки/БАД', id: 'bad' },
    { title: 'Микросферы', id: 'microspheres' },
    { title: 'Скребки/Массажеры', id: 'scrapers' },
    { title: 'Банки', id: 'banks' },
    { title: 'Остальные категории', id: 'others' },
  ];

  // Эффект автоматического сохранения корзины
  useEffect(() => {
    localStorage.setItem('ogulov_shop_cart', JSON.stringify(cart));
  }, [cart]);

  // Эффект автоматического сохранения списка желаний
  useEffect(() => {
    localStorage.setItem('ogulov_shop_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Функция добавления товара в корзину
  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Полное удаление товара из корзины (по кнопке крестика)
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Изменение количества товара (+1 или -1)
  const updateQuantity = (productId, action) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0) 
    );
  };

  // Функция полной очистки корзины
  const clearCart = () => {
    setCart([]);
  };

  // Все данные и функции, к которым мы хотим дать доступ всему сайту
  const value = {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity, 
    clearCart,      
    favorites,
    setFavorites,
    menuItems
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// 3. Создаем кастомный хук
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop должен использоваться внутри ShopProvider');
  }
  return context;
}
