import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import shopService from '@/api/shopService';

// 1. Создаем сам контекст
export const ShopContext = createContext();

// 2. Создаем Провайдер, который будет хранить все стейты
export function ShopProvider({ children }) {
  // Асинхронные состояния для данных из Django REST Framework
  const [productsData, setProductsData] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('all');
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

  // --- УМНАЯ ИНИЦИАЛИЗАЦИЯ СЕССИИ И ПРОФИЛЯ (Защита от F5) ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const hasToken = localStorage.getItem('ogulov_access_token');
    const hasMockAuth = localStorage.getItem('ogulov_mock_authenticated');
    return !!(hasToken || hasMockAuth === 'true');
  });

  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('ogulov_user_profile');
    return savedProfile ? JSON.parse(savedProfile) : {
      id: 14,
      email: "user@ogulov.com",
      first_name: "Александр",
      last_name: "Петров",
      phone: "+996 (555) 12-34-56",
      city: "Бишкек",
      address: "ул. Чуй, д. 114, кв. 42",
      avatar_url: null
    };
  });

  const [userOrders, setUserOrders] = useState(() => {
    const savedOrders = localStorage.getItem('ogulov_user_orders');
    return savedOrders ? JSON.parse(savedOrders) : [
      {
        order_number: "OG-2026-001",
        created_at: "2026-05-20T15:30:00Z",
        status: "processing",
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
    ];
  });

  // Единый источник правды для категорий Огулова
  const menuItems = [
    { title: 'Книги', id: 'books', subcategories: [] }, 
    { title: 'Плакаты Огулова А.Т.', id: 'posters', subcategories: [] },
    { title: 'Устройство очистки ПВВК', id: 'pvvk', subcategories: [] },
    { 
      title: 'Пищевые добавки/БАД', 
      id: 'bad', 
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

  // --- АСИНХРОННЫЙ КОНВЕЙЕР ПОЛУЧЕНИЯ ДАННЫХ ИЗ DJANGO REST FRAMEWORK ---
  const fetchProductsFromBackend = useCallback(async () => {
    setIsProductsLoading(true);
    setProductsError(null);
    try {
      // Запрашиваем полный адаптированный массив через наш API-сервис
      const data = await shopService.getProducts();
      setProductsData(data);
    } catch (err) {
      setProductsError('Ошибка подключения к серверу Django. Выведены локальные данные.');
      console.error('Критическая ошибка инициализации каталога:', err);
    } finally {
      setIsProductsLoading(false);
    }
  }, []);

  // Первичный вызов триггера при монтировании компонента ядра
  useEffect(() => {
    fetchProductsFromBackend();
  }, [fetchProductsFromBackend]);

  // --- СИНХРОНИЗАЦИЯ С ЛОКАЛЬНОЙ ПАМЯТЬЮ (localStorage) ---
  useEffect(() => {
    localStorage.setItem('ogulov_shop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ogulov_shop_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      localStorage.setItem('ogulov_mock_authenticated', 'true');
      localStorage.setItem('ogulov_user_profile', JSON.stringify(userProfile));
    }
  }, [userProfile, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && userOrders) {
      localStorage.setItem('ogulov_user_orders', JSON.stringify(userOrders));
    }
  }, [userOrders, isAuthenticated]);

  // --- БЕЗОПАСНЫЕ УТИЛИТЫ И ФУНКЦИИ (Защита принудительным кастом типов к String) ---
  
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    if (typeof priceStr === 'number') return priceStr;
    const cleanStr = priceStr.toString().replace(/[^0-9.]/g, '');
    return parseFloat(cleanStr) || 0;
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parsePrice(item.price);
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const addToCart = (product) => {
    if (!product) return;
    setCart((prevCart) => {
      // Безопасное сравнение через явное приведение ID к строке
      const exists = prevCart.find((item) => String(item.id) === String(product.id));
      if (exists) {
        return prevCart.map((item) =>
          String(item.id) === String(product.id) ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => String(item.id) !== String(productId)));
  };

  const updateQuantity = (productId, action) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (String(item.id) === String(productId)) {
            const isPlus = action === 'increase' || action === 'increment';
            const newQty = isPlus ? (item.quantity || 1) + 1 : (item.quantity || 1) - 1;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0) 
    );
  };

  const clearCart = () => setCart([]);

  const toggleFavorite = (product) => {
    if (!product) return;
    setFavorites((prevFavs) => {
      const exists = prevFavs.find((item) => String(item.id) === String(product.id));
      if (exists) {
        return prevFavs.filter((item) => String(item.id) !== String(product.id));
      }
      return [...prevFavs, product];
    });
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setUserOrders([]);
    localStorage.removeItem('ogulov_access_token');
    localStorage.removeItem('ogulov_mock_authenticated');
    localStorage.removeItem('ogulov_user_profile');
    localStorage.removeItem('ogulov_user_orders');
  };

  const value = {
    // Новый реактивный динамический массив товаров из Django DRF
    productsData,
    isProductsLoading,
    productsError,
    refreshProducts: fetchProductsFromBackend,

    activeCategory, setActiveCategory,
    activeSubcategory, setActiveSubcategory, 
    searchQuery, setSearchQuery,
    cart, addToCart, removeFromCart, updateQuantity, clearCart,      
    favorites, setFavorites, toggleFavorite,
    menuItems, getCartCount, getCartTotal, parsePrice,
    isAuthenticated, setIsAuthenticated,
    userProfile, setUserProfile,
    userOrders, setUserOrders,
    logoutUser
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// 3. Кастомный хук useShop
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop должен использоваться внутри ShopProvider');
  }
  return context;
}
