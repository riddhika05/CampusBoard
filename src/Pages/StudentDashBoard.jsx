
import React from 'react';
import StudentHeader from '../components/StudentHeader';
import './StudentDashBoard.css';

export default function StudentDashBoard() {
  return (
    <>
      
      <StudentHeader />
      
      <div className="student-dashboard-container">
        <div className="student-dashboard-content">
          <h1>Welcome to Student Dashboard</h1>
          <p>Browse announcements and manage your applications</p>
        </div>
      </div>
    </>
  );
}