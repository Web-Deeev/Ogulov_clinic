import React from 'react';
import { Carousel } from 'react-bootstrap';
 

export default function ShopBanner() {
  return (
    <Carousel 
      id="shopBanner" 
      className="shop-banner mb-4"
      interval={4000} // Картинки будут меняться автоматически каждые 4 секунды
      indicators={true} // Добавит снизу аккуратные точки-индикаторы слайдов
      fade={false} // Если хочешь плавное затухание вместо прокрутки, поменяй на true
    >
      <Carousel.Item>
        <img
          src="/images/banner-1.jpeg"
          className="d-block w-100 object-fit-cover"
          alt="banner 1"
          style={{ maxHeight: '450px' }}
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          src="/images/banner-2.png"
          className="d-block w-100 object-fit-cover"
          alt="banner 2"
          style={{ maxHeight: '450px' }}
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          src="/images/banner-3.jpg"
          className="d-block w-100 object-fit-cover"
          alt="banner 3"
          style={{ maxHeight: '450px' }}
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          src="/images/banner-4.jpg"
          className="d-block w-100 object-fit-cover"
          alt="banner 4"
          style={{ maxHeight: '450px' }}
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          src="/images/banner-5.png"
          className="d-block w-100 object-fit-cover"
          alt="banner 5"
          style={{ maxHeight: '450px' }}
        />
      </Carousel.Item>
    </Carousel>
  );
}
