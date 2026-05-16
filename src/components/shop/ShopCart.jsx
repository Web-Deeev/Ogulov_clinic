import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from './ShopContext';
import { Table, Button, Card, Row, Col, Form } from 'react-bootstrap';

export default function Cart() {
  // Достаем корзину и функции управления из глобального контекста
  const { cart, updateQuantity, removeFromCart, clearCart } = useShop();

  // Функция превращения строки "4 200 сом" в число 4200 для расчетов
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseInt(priceStr.toString().replace(/[^0-9]/g, ''), 10) || 0;
  };

  // Считаем общую стоимость всей корзины
  const totalCartPrice = cart.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity;
  }, 0);

  // Имитация отправки заказа в Django DRF (POST-запрос)
  const handleCheckout = (e) => {
    e.preventDefault();
    
    // Структура данных, которую мы позже отправим на бэкенд:
    const orderData = {
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      })),
      total_amount: totalCartPrice,
      city: 'Бишкек'
    };

    alert(`Заказ сформирован!\nСтруктура готова под Django DRF:\n${JSON.stringify(orderData, null, 2)}`);
    clearCart(); // Очищаем корзину после заказа
  };

  // Если корзина пуста
  if (cart.length === 0) {
    return (
      <div className="container my-5 py-5 text-center bg-white rounded shadow-sm">
        <h2 className="mb-3 text-dark">Ваша корзина пуста</h2>
        <p className="text-muted small">Вы еще не добавили ни одного оздоровительного товара.</p>
        <Link to="/shop" className="btn btn-success mt-3 btn-ogulov">
          Перейти к покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="shop-breadcrumbs mb-4 small text-muted">
        <Link to="/shop" className="text-decoration-none text-success">Главная магазина</Link>
        <span className="mx-2">/</span>
        <span className="text-dark">Корзина</span>
      </div>

      <h1 className="mb-4 fw-bold text-dark">Оформление заказа</h1>

      <Row className="g-4">
        {/* ЛЕВАЯ ЧАСТЬ: Список товаров в корзине */}
        <Col lg={8}>
          <div className="bg-white p-4 rounded shadow-sm table-responsive">
            <Table align="middle" className="mb-0 text-nowrap">
              <thead>
                <tr className="text-secondary small">
                  <th>Товар</th>
                  <th>Цена</th>
                  <th className="text-center">Количество</th>
                  <th>Итого</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const itemPrice = parsePrice(item.price);
                  const itemTotalPrice = itemPrice * item.quantity;

                  return (
                    <tr key={item.id}>
                      {/* Картинка и Название */}
                      <td style={{ minWidth: '250px' }}>
                        <div className="d-flex align-items-center gap-3">
                          <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                          <Link to={`/shop/product/${item.id}`} className="text-decoration-none text-dark fw-medium small text-wrap d-block">
                            {item.title}
                          </Link>
                        </div>
                      </td>
                      
                      {/* Цена за 1 шт */}
                      <td className="fw-semibold text-secondary">{item.price}</td>
                      
                      {/* Кнопки + / - */}
                      <td className="text-center">
                        <div className="d-inline-flex align-items-center border rounded-pill bg-light px-2 py-1">
                          <button 
                            className="btn btn-sm p-0 border-0 fw-bold px-2 text-secondary"
                            onClick={() => updateQuantity(item.id, 'decrease')}
                          >
                            -
                          </button>
                          <span className="mx-3 fw-bold small text-dark" style={{ minWidth: '15px' }}>{item.quantity}</span>
                          <button 
                            className="btn btn-sm p-0 border-0 fw-bold px-2 text-secondary"
                            onClick={() => updateQuantity(item.id, 'increase')}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Итоговая цена за позицию */}
                      <td className="fw-bold text-success">
                        {itemTotalPrice.toLocaleString()} сом
                      </td>

                      {/* Удаление */}
                      <td className="text-end">
                        <Button 
                          variant="link" 
                          className="text-danger p-0 border-0 text-decoration-none"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ❌
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Col>

        {/* ПРАВАЯ ЧАСТЬ: Итоговый чек и быстрая форма оформления */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold text-dark mb-3">Итого к оплате</h5>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <span className="text-secondary small">Сумма заказа:</span>
              <span className="fs-3 fw-bold text-success">{totalCartPrice.toLocaleString()} сом</span>
            </div>

                {/* Временная форма сбора контактов покупателя */}
            <Form onSubmit={handleCheckout}>
              <Form.Group className="mb-3">
                {/* ИСПРАВЛЕНО: тег </Form.Label> теперь закрывается правильно */}
                <Form.Label className="small fw-semibold text-secondary">Ваше имя</Form.Label>
                <Form.Control type="text" size="sm" placeholder="Иван Иванов" required className="border-secondary-subtle" />
              </Form.Group>

              <Form.Group className="mb-4">
                {/* ИСПРАВЛЕНО: тег </Form.Label> теперь закрывается правильно */}
                <Form.Label className="small fw-semibold text-secondary">Телефон для связи</Form.Label>
                <Form.Control type="tel" size="sm" placeholder="+996 (XXX) XX-XX-XX" required className="border-secondary-subtle" />
              </Form.Group>

              <Button type="submit" variant="success" className="w-100 py-2.5 fw-bold btn-ogulov">
                Оформить заказ
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
