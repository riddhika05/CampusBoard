import React, { useState, useEffect } from 'react';
import './Home.css';

const images = [
  '/src/assets/Courses.jpg',
  '/src/assets/Seminars.jpg',
  '/src/assets/webinar.jpg',
];

const overlays = [
  'Courses',
  'Seminars',
  'Webinars',
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const goToPrev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const goToNext = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className="carousel-container">
      <div className="carousel-image-wrapper">
        <img
          src={images[current]}
          alt={`slide-${current}`}
          className="carousel-image"
        />
        <div className="carousel-overlay">{overlays[current]}</div>
      </div>
      <button onClick={goToPrev} className="carousel-btn prev">&lt;</button>
      <button onClick={goToNext} className="carousel-btn next">&gt;</button>
      <div className="carousel-dots">
        {images.map((_, idx) => (
          <span key={idx} className={`carousel-dot${idx === current ? ' active' : ''}`}></span>
        ))}
      </div>
    </div>
  );
};

export default Home; 