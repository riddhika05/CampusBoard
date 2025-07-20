import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import StudentHeader from '../components/StudentHeader';
import './StudentApplications.css';
import { Link } from 'react-router-dom';

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchApplications(user.id);
      }
    };
    
    fetchUser();
  }, []);

  // Fetch user's applications with announcement details
  const fetchApplications = async (userId) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          announcements (
            id,
            title,
            description,
            type,
            duration,
            webinar_link,
            video_url,
            last_date,
            created_at
          )
        `)
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setApplications(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle application withdrawal
  const handleWithdraw = async (registrationId) => {
    if (!window.confirm('Are you sure you want to withdraw your application?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', registrationId);

      if (error) throw error;

      // Remove from local state
      setApplications(prev => prev.filter(app => app.id !== registrationId));
    } catch (err) {
      console.error('Withdrawal error:', err);
      setError(err.message);
    }
  };

  return (
    <>
      <StudentHeader />
      
      <div className="student-applications-container">
        <div className="student-applications-content">
          <h1>Activity Center</h1>
          <p className="subtitle">Track your applications and manage your opportunities</p>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading-spinner">Loading your applications...</div>
          ) : applications.length === 0 ? (
            <div className="no-applications">
              <h3>No Applications Yet</h3>
              <p>You haven't applied to any announcements yet. Start exploring opportunities!</p>
              <Link to="/student/announcements" className="browse-btn">
                Browse Announcements
              </Link>
            </div>
          ) : (
            <div className="applications-grid">
              {applications.map(application => {
                const announcement = application.announcements;
                const lastDate = new Date(announcement.last_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isExpired = lastDate < today;
                
                return (
                  <div key={application.id} className="application-card">
                    <div className="application-header">
                      <h3>{announcement.title}</h3>
                      <span className={`status-badge ${application.status}`}>
                        {application.status}
                      </span>
                    </div>
                    
                    <div className="application-meta">
                      <span className="announcement-type">{announcement.type}</span>
                      <span className="application-date">
                        Applied: {new Date(application.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="application-description">{announcement.description}</p>
                    
                    {announcement.last_date && (
                      <div className={`announcement-deadline ${isExpired ? 'expired-deadline' : ''}`}>
                        Deadline: {new Date(announcement.last_date).toLocaleDateString()}
                        {isExpired && <span className="expired-text"> (Expired)</span>}
                      </div>
                    )}
                    
                    {announcement.duration && (
                      <div className="announcement-duration">
                        Duration: {announcement.duration}
                      </div>
                    )}
                    
                    {announcement.webinar_link && (
                      <a href={announcement.webinar_link} target="_blank" rel="noopener noreferrer" className="webinar-link">
                        Join Webinar
                      </a>
                    )}
                    
                    {announcement.video_url && (
                      <a href={announcement.video_url} target="_blank" rel="noopener noreferrer" className="video-link">
                        Watch Video
                      </a>
                    )}
                    
                    <div className="application-actions">
                      <button 
                        className="view-details-btn"
                        onClick={() => window.open(`/student/announcements`, '_blank')}
                      >
                        View Details
                      </button>
                      <button 
                        className="withdraw-btn"
                        onClick={() => handleWithdraw(application.id)}
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
