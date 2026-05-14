import { useState } from "react";
import { ShopHeader, ShopTopBar } from "./ShopHeader"; 
import ShopAbout from "./ShopAbout";       
import ShopPayment from "./ShopPayment";   
import ShopDelivery from "./ShopDelivery";
import ShopContacts from "./ShopContacts"; 
import ShopFooter from "./ShopFooter";     
import ShopBanner from "./ShopBanner";
import ShopCart from "./ShopCart";

import '../../style.css';
import './shop.css';

const hits = [
  {
    title: 'Книга "Клиническая анатомия человека"',
    image: '/images/shop/products/hit-1.jpg',
    price: '4 200 руб.',
    label: 'Хит',
  },
  {
    title: 'Плакат 3 в 1',
    image: '/images/shop/products/hit-2.jpg',
    price: '3 100 руб.',
    label: 'Хит',
  },
  {
    title: 'Устройство очистки ПВВК',
    image: '/images/shop/products/hit-3.jpg',
    price: '11 800 руб.',
    label: 'Хит',
  },
  {
    title: 'Методы функциональной диагностики',
    image: '/images/shop/products/hit-4.jpg',
    price: '4 200 руб.',
    label: 'Хит',
  },
  {
    title: 'Универсальные палочки Ахмат',
    image: '/images/shop/products/hit-5.jpg',
    price: '8 800 руб.',
  },
  {
    title: 'Большой плакат 3 в 1',
    image: '/images/shop/products/hit-6.jpg',
    price: '1 700 руб.',
    label: 'Хит',
  },
]

const news = [
  {
    title: 'Массажная рукавица',
    image: '/images/shop/products/new-1.jpg',
    price: '1 850 руб.',
    label: 'Рекомендовано',
  },
  {
    title: 'Скребок Гуаша для массажа',
    image: '/images/shop/products/new-2.jpg',
    price: '1 780 руб.',
    label: 'Рекомендовано',
  },
  {
    title: 'Скребок для массажа',
    image: '/images/shop/products/new-3.jpg',
    price: '1 780 руб.',
    label: 'Рекомендовано',
  },
  {
    title: 'Скребок для массажа Гуаша',
    image: '/images/shop/products/new-4.jpg',
    price: '1 780 руб.',
    label: 'Рекомендовано',
  },
  {
    title: 'Скребок для массажа',
    image: '/images/shop/products/new-5.jpg',
    price: '1 850 руб.',
    label: 'Рекомендовано',
  },
  {
    title: 'Скребок для массажа',
    image: '/images/shop/products/new-6.jpg',
    price: '1 780 руб.',
    label: 'Рекомендовано',
  },
]

const sales = [
  {
    title: 'Книга "Анатомия человека"',
    image: '/images/shop/products/sale-1.jpg',
    oldPrice: '3 200 руб.',
    price: '2 720 руб.',
    label: 'Скидка 15%',
  },
  {
    title: 'Устройство очистки ПВВК',
    image: '/images/shop/products/sale-2.jpg',
    oldPrice: '13 900 руб.',
    price: '11 800 руб.',
    label: 'Скидка 15%',
  },
  {
    title: 'Пластырь "Витон"',
    image: '/images/shop/products/sale-3.jpg',
    oldPrice: '650 руб.',
    price: '550 руб.',
    label: 'Скидка 15%',
  },
  {
    title: 'Поясница не могу ходить',
    image: '/images/shop/products/sale-4.jpg',
    oldPrice: '1 200 руб.',
    price: '1 020 руб.',
    label: 'Скидка 15%',
  },
]



export default function ShopHomePage() {
  const [currentView, setCurrentView] = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);

  return (
    <div className="shop-page">
      <ShopTopBar />
      
      <ShopHeader 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        totalItems={cart.length} 
        setActiveCategory={setActiveCategory}
        activeCategory={activeCategory}
      />

      {/* Контент витрины или инфо-страниц */}
      {currentView === 'home' && <main className="container">...</main>}
      {currentView === 'about' && <ShopAbout setCurrentView={setCurrentView} />}
      {currentView === 'payment' && <ShopPayment setCurrentView={setCurrentView} />}
      {currentView === 'delivery' && <ShopDelivery setCurrentView={setCurrentView} />}
      {currentView === 'contacts' && <ShopContacts setCurrentView={setCurrentView} />}

      {/* Подключаем живую корзину */}
      {currentView === 'cart' && (
        <ShopCart 
          cart={cart} 
          setCart={setCart} 
          setCurrentView={setCurrentView} 
        />
      )}


      {/* 2. ВСТАВЛЯЕМ КОМПОНЕНТ И ПЕРЕДАЕМ ФУНКЦИЮ НАВИГАЦИИ */}
      <ShopFooter setCurrentView={setCurrentView} />
    </div>
  );
}

// 4. Карточка товара с рабочей кнопкой покупки
export function ProductCard({ product, onBuyClick }) {
  return (
    <div className="shop-product">
      <div className="shop-product-image">
        {product.label && (
          <div className={product.label === 'Рекомендовано' ? 'badge badge-blue' : 'badge'}>
            {product.label}
          </div>
        )}
        <img src={product.image} alt={product.title} />
      </div>

      <div className="shop-product-title">{product.title}</div>

      {product.oldPrice && <div className="shop-product-old">{product.oldPrice}</div>}
      <div className="shop-product-price">{product.price}</div>
      
      {/* Интерактивная кнопка добавления в корзину */}
      <button className="shop-buy-btn" onClick={() => onBuyClick(product)}>
        Купить
      </button>
    </div>
  );
}

// 5. Секция товаров, пробрасывающая функцию клика в карточки
export function ProductSection({ title, products, onBuyClick }) {
  return (
    <section className="shop-section">
      <h2>{title}</h2>

      <div className="shop-products-grid">
        {products.map((product) => (
          <ProductCard 
            product={product} 
            key={product.id || product.title} 
            onBuyClick={onBuyClick} 
          />
        ))}
      </div>
    </section>
  );
}