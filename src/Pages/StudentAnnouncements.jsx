import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import StudentHeader from '../components/StudentHeader';
import './StudentAnnouncements.css';

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all announcements
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <>
      <StudentHeader />
      
      <div className="student-announcements-container">
        <div className="student-announcements-content">
          <h1>Available Announcements</h1>
          
          {loading ? (
            <div className="loading-spinner">Loading announcements...</div>
          ) : error ? (
            <div className="error-message">Error: {error}</div>
          ) : announcements.filter(announcement => {
            const lastDate = new Date(announcement.last_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return lastDate >= today;
          }).length === 0 ? (
            <p className="no-announcements">No active announcements available at the moment.</p>
          ) : (
            <div className="announcements-grid">
              {announcements
                .filter(announcement => {
                  const lastDate = new Date(announcement.last_date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return lastDate >= today; // Only show non-expired announcements
                })
                .map(announcement => {
                  const lastDate = new Date(announcement.last_date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isExpired = lastDate < today;
                  
                  return (
                    <div key={announcement.id} className={`announcement-card ${isExpired ? 'expired' : ''}`}>
                    <h3>{announcement.title}</h3>
                    <div className="announcement-meta">
                      <span className="announcement-type">{announcement.type}</span>
                      <span className="announcement-date">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                      {isExpired && (
                        <span className="expired-badge">EXPIRED</span>
                      )}
                    </div>
                    <p>{announcement.description}</p>
                    
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
                    
                    <button className="apply-btn">
                      Apply Now
                    </button>
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