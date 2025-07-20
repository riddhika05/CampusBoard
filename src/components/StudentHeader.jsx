import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './StudentHeader.css';

export default function StudentHeader() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);



  if (loading) {
    return <div className="student-header-loading">Loading...</div>;
  }

  return (
    <div className="student-header">
      <div className="student-header-content">
        <div className="student-header-left">
          <h1 className="student-header-title">CampusBoard</h1>
          <p className="student-header-subtitle">Student Portal</p>
        </div>
        
        <div className="student-header-center">
                    <nav className="student-nav">
            <ul>
              <li><Link to="/student" className="nav-link">Dashboard</Link></li>
              <li><Link to="/student/announcements" className="nav-link">Announcements</Link></li>
              <li><Link to="/student/applications" className="nav-link">Activity Center</Link></li>
            </ul>
          </nav>
        </div>

        <div className="student-header-right">
          {user ? (
            <div className="student-user-info">
              <span className="student-email">{user.email}</span>
            </div>
          ) : (
            <div className="student-auth-buttons">
              <Link to="/login" className="student-login-btn">Login</Link>
              <Link to="/signup" className="student-signup-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 