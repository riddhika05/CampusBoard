import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './AdminDashBoard.css';
import AnnouncementForm from './AnnouncementForm';
import { Link, useNavigate } from 'react-router-dom';
export default function AdminDashBoard() {
  const [form, setForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationCounts, setApplicationCounts] = useState({});

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
      
      // Fetch application counts for each announcement
      if (data && data.length > 0) {
        await fetchApplicationCounts(data.map(a => a.id));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch application counts for announcements
  const fetchApplicationCounts = async (announcementIds) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('announcement_id')
        .in('announcement_id', announcementIds);

      if (error) throw error;

      // Count applications per announcement
      const counts = {};
      data.forEach(registration => {
        counts[registration.announcement_id] = (counts[registration.announcement_id] || 0) + 1;
      });

      setApplicationCounts(counts);
    } catch (err) {
      console.error('Application count fetch error:', err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const post_form = () => setForm(true);
  const close_form = () => {
    setForm(false);
    setEditingAnnouncement(null);
    fetchAnnouncements(); // Refresh list after form closes
  };

  const editAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setForm(true);
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
    
    } catch (err) {
      console.error('Delete error:', err);
     
    }
  };

  return (
    <>
  
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <ul>
          <li onClick={post_form}>
            Post Announcements!
          </li>
          <li >
            <Link to='/analytics'>
             See Analytics
             </Link>
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
                  <span className="application-count">
                    {applicationCounts[announcement.id] || 0} Applications
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
                
                <div className="announcement-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => editAnnouncement(announcement)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteAnnouncement(announcement.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Announcement Form Modal */}
      {form && (
        <>
          <div className="announcement-modal-overlay" onClick={close_form}></div>
          <AnnouncementForm 
            onClose={close_form} 
            editingAnnouncement={editingAnnouncement}
          />
        </>
      )}
    </div>
    </>
  );
}