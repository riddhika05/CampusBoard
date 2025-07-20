import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './AdminDashBoard.css';
import AnnouncementForm from './AnnouncementForm';

export default function AdminDashBoard() {
  const [form, setForm] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's announcements
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('user_id', user.id)
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

  const post_form = () => setForm(true);
  const close_form = () => {
    setForm(false);
    fetchAnnouncements(); // Refresh list after form closes
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <ul>
          <li onClick={post_form}>
            Post Announcements!
          </li>
        </ul>
      </div>

      {/* Announcements List */}
      <div className="announcements-list">
        <h2>Your Announcements</h2>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : announcements.length === 0 ? (
          <p>No announcements yet. Create your first one!</p>
        ) : (
          announcements.map(announcement => {
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
                
                {announcement.video_url && (
                  <a href={announcement.video_url} target="_blank" rel="noopener noreferrer">
                    View Video
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Announcement Form Modal */}
      {form && (
        <>
          <div className="announcement-modal-overlay" onClick={close_form}></div>
          <AnnouncementForm onClose={close_form} />
        </>
      )}
    </div>
  );
}