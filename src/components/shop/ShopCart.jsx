import React from 'react';

export default function ShopCart({ cart, setCart, setCurrentView }) {
  
  // Функция изменения количества товара (+ или -)
  const changeCount = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, count: item.count + delta } : item
        )
        .filter((item) => item.count > 0) // Если количество стало 0, товар удаляется
    );
  };

  // Функция полного удаления товара из корзины
  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Подсчет итоговой стоимости заказа
  const totalPrice = cart.reduce((sum, item) => {
    // Извлекаем только цифры из строки цены (например, "1200 сом" -> 1200)
    const priceNum = parseInt(item.price) || 0;
    return sum + priceNum * item.count;
  }, 0);

  // Имитация отправки формы заказа
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    alert('Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время для подтверждения доставки.');
    setCart([]); // Очищаем корзину после заказа
    setCurrentView('home'); // Возвращаем на главную
  };

  return (
    <div className="container info-page-content">
      {/* Хлебные крошки */}
      <div className="shop-breadcrumbs">
        <a href="#home" onClick={(e) => { e.preventDefault(); setCurrentView('home'); }}>Главная</a>
        <span className="breadcrumbs-separator">/</span>
        <span className="breadcrumbs-current">Корзина</span>
      </div>

      <h1>Оформление заказа</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Ваша корзина пуста.</p>
          <button 
            onClick={() => setCurrentView('home')}
            style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '15px' }}
          >
            Вернуться к покупкам
          </button>
        </div>
      ) : (
        <div className="cart-wrapper" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '30px' }}>
          
          {/* ЛЕВАЯ ЧАСТЬ: Список товаров */}
          <div className="cart-items-list" style={{ flex: '2', minWidth: '300px' }}>
            {cart.map((item) => {
              const itemTotal = (parseInt(item.price) || 0) * item.count;
              return (
                <div key={item.id} className="cart-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                  <div style={{ flex: '1' }}>
                    <div style={{ fontWeight: '500', fontSize: '16px' }}>{item.title}</div>
                    <div style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Цена: {item.price}</div>
                  </div>
                  
                  {/* Управление количеством */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 20px' }}>
                    <button onClick={() => changeCount(item.id, -1)} style={{ width: '30px', height: '30px', cursor: 'pointer' }}>-</button>
                    <span style={{ fontSize: '16px', fontWeight: '500', minWidth: '20px', textAlign: 'center' }}>{item.count}</span>
                    <button onClick={() => changeCount(item.id, 1)} style={{ width: '30px', height: '30px', cursor: 'pointer' }}>+</button>
                  </div>

                  {/* Итого за позицию и удаление */}
                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <div style={{ fontWeight: 'bold' }}>{itemTotal} сом</div>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '13px', marginTop: '5px' }}>Удалить</button>
                  </div>
                </div>
              );
            })}
            
            <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '20px', fontWeight: 'bold' }}>
              Итого: <span style={{ color: '#007bff' }}>{totalPrice} сом</span>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: Контактная форма оформления */}
          <div className="cart-order-form" style={{ flex: '1', minWidth: '28px', background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>Контактные данные</h3>
            <form onSubmit={handleSubmitOrder}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Ваше имя *</label>
                <input type="text" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Телефон *</label>
                <input type="tel" required placeholder="+996" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Адрес доставки *</label>
                <textarea required placeholder="Город, улица, дом, квартира" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}></textarea>
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                Подтвердить заказ
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}
