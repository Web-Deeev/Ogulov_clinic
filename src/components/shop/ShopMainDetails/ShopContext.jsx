import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Создаем сам контекст
export const ShopContext = createContext();

// 2. Создаем Провайдер, который будет хранить все стейты
export function ShopProvider({ children }) {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Передаем сквозные стейты для подкатегорий и окошек сайдбара
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Инициализация корзины из localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('ogulov_shop_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Инициализация списка желаний из localStorage
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('ogulov_shop_favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  // --- Стейты авторизации и Личного Кабинета ---
  const [isAuthenticated, setIsAuthenticated] = useState(true); // true для разработки

  const [userProfile, setUserProfile] = useState({
    id: 14,
    email: "user@ogulov.com",
    first_name: "Александр",
    last_name: "Петров",
    phone: "+996 (555) 12-34-56",
    city: "Бишкек",
    address: "ул. Чуй, д. 114, кв. 42"
  });

  const [userOrders, setUserOrders] = useState([
    {
      order_number: "OG-2026-001",
      created_at: "2026-05-20T15:30:00Z",
      status: "processing", // под бэк: processing, shipped, delivered, canceled
      delivery_method: "bishkek",
      total_price: "2400.00",
      items: [
        {
          product_title: "Книга «Азбука висцеральной терапии»",
          quantity: 2,
          price_at_purchase: "1200.00"
        }
      ]
    }
  ]);

  // Единый источник правды для категорий.
  // Сохранили твой родной ID 'bad' для сайдбара и зашили структуру окошек-подкатегорий
  const menuItems = [
    { title: 'Книги', id: 'books', subcategories: [] }, 
    { title: 'Плакаты Огулова А.Т.', id: 'posters', subcategories: [] },
    { title: 'Устройство очистки ПВВК', id: 'equipment', subcategories: [] },
    { 
      title: 'Пищевые добавки/БАД', 
      id: 'bad', // Твой родной ID
      subcategories: [
        { id: 'bady-fulvo', title: 'Фульво-гуминовые комплексы' },
        { id: 'bady-vitauct', title: 'VITAUCT' },
        { id: 'bady-herbs-honey', title: 'Травы и мёд' },
        { id: 'bady-health', title: 'Мужское и женское здоровье' },
        { id: 'bady-bee-power', title: 'Сила пчелы' },
        { id: 'bady-tea', title: 'Чай' }
      ]
    },
    { title: 'Микросферы', id: 'microspheres', subcategories: [] },
    { title: 'Скребки/Массажеры', id: 'scrapers', subcategories: [] },
    { title: 'Банки', id: 'banks', subcategories: [] },
    { title: 'Остальные категории', id: 'others', subcategories: [] },
  ];

  // Эффект автоматического сохранения корзины
  useEffect(() => {
    localStorage.setItem('ogulov_shop_cart', JSON.stringify(cart));
  }, [cart]);

  // Эффект автоматического сохранения списка желаний
  useEffect(() => {
    localStorage.setItem('ogulov_shop_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Утилита для очистки строки цены и превращения её в число
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseInt(priceStr.toString().replace(/[^0-9]/g, ''), 10) || 0;
  };

  // Подсчет общего количества единиц товара в корзине
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Подсчет итоговой суммы заказа в сомах
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parsePrice(item.price);
      return total + (price * item.quantity);
    }, 0);
  };

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

  // Полное удаление товара из корзины
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

  // Функция переключения (добавления/удаления) товара в Избранное
  const toggleFavorite = (product) => {
    setFavorites((prevFavs) => {
      const exists = prevFavs.find((item) => item.id === product.id);
      if (exists) {
        return prevFavs.filter((item) => item.id !== product.id);
      }
      return [...prevFavs, product];
    });
  };

  // Все данные и функции, к которым мы хотим дать доступ всему сайту
  const value = {
    activeCategory,
    setActiveCategory,
    activeSubcategory,    
    setActiveSubcategory, 
    searchQuery,
    setSearchQuery,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity, 
    clearCart,      
    favorites,
    setFavorites,
    toggleFavorite,
    menuItems,
    getCartCount, 
    getCartTotal,
    isAuthenticated,
    setIsAuthenticated,
    userProfile,
    setUserProfile,
    userOrders,
    setUserOrders
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// 3. Тот самый экспортируемый кастомный хук, который искал Vite
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop должен использоваться внутри ShopProvider');
  }
  return context;
}
