import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useShop } from './ShopContext'; // Импортируем наш хук
import ShopProductCard from './ShopProductCard';

export default function ShopCatalog() {
  // Достаем готовый, отфильтрованный по категории и поиску массив товаров из контекста
  const { filteredProducts } = useShop();

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold text-dark">Каталог продукции</h2>
      
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {filteredProducts.map((item) => (
          <Col key={item.id}>
            <ProductCard product={item} />
          </Col>
        ))}
      </Row>

      {/* Если в выбранной категории поиске ничего нет */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-5 text-muted bg-white rounded shadow-sm my-4">
          <h5>Товары не найдены</h5>
          <p className="mb-0">Попробуйте изменить поисковый запрос или выбрать другую категорию.</p>
        </div>
      )}
    </div>
  );
}
