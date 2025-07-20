import React, { useState, useEffect } from 'react';
import './Home.css';
import Courses from '../assets/Courses.jpg';
import Seminars from '../assets/Seminars.jpg';
import webinar from '../assets/webinar.jpg';
import intern from '../assets/intern.jpg';
import job from '../assets/job.jpg';
import demoVideo from '../assets/Demo.mp4';

const images = [
  Courses,
  Seminars,
  webinar,
  intern,
  job,
];

const overlays = [
  'Courses',
  'Seminars',
  'Webinars',
  'Internships',
  'Jobs',
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
    <div className="home-container">
      {/* Carousel Section */}
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

      {/* Walkthrough Section */}
      <div className="walkthrough-section">
        <div className="walkthrough-content">
          <div className="walkthrough-text">
            <h2>See CampusBoard in Action</h2>
            <p>Watch our quick demo to see how easy it is to browse opportunities, apply for positions, and track your applications all in one place.</p>
            <div className="walkthrough-features">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Easy Application Process</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Track Your Progress</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔔</span>
                <span>Stay Updated</span>
              </div>
            </div>
          </div>
          <div className="video-container">
            <video 
              controls 
              className="demo-video"
              poster={Courses} // Using first carousel image as poster
            >
              <source src={demoVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-overlay">
              <span className="play-icon">▶️</span>
              <span className="play-text">Watch Demo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 