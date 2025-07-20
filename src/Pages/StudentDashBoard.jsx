
import React from 'react';
import { Link } from 'react-router-dom';
import StudentHeader from '../components/StudentHeader';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import './StudentDashBoard.css';

export default function StudentDashBoard() {
  return (
    <>
      <StudentHeader />
      
      <div className="student-dashboard-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1>Welcome to Your Student Portal</h1>
            <p>Discover opportunities, track applications, and stay connected with campus announcements</p>
            <div className="hero-buttons">
              <Link to="/student/announcements" className="hero-btn primary">
                Browse Opportunities
              </Link>
              <Link to="/student/applications" className="hero-btn secondary">
                View Applications
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={img1} alt="Student Success" />
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>What You Can Do</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-image">
                <img src={img2} alt="Browse Opportunities" />
              </div>
              <div className="feature-content">
                <h3>Browse Opportunities</h3>
                <p>Explore internships, jobs, courses, and training sessions from top organizations</p>
                <Link to="/student/announcements" className="feature-link">
                  Start Exploring →
                </Link>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-image">
                <img src={img3} alt="Track Applications" />
              </div>
              <div className="feature-content">
                <h3>Track Applications</h3>
                <p>Monitor your application status and manage all your submissions in one place</p>
                <Link to="/student/applications" className="feature-link">
                  View Applications →
                </Link>
              </div>
            </div>
          </div>
        </div>

       

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/student/announcements" className="action-card">
              <div className="action-icon">🔍</div>
              <h3>Search Opportunities</h3>
              <p>Find the perfect internship or job</p>
            </Link>

            <Link to="/student/applications" className="action-card">
              <div className="action-icon">📋</div>
              <h3>My Applications</h3>
              <p>Track your application status</p>
            </Link>

            <div className="action-card">
              <div className="action-icon">📧</div>
              <h3>Contact Support</h3>
              <p>Get help when you need it</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}