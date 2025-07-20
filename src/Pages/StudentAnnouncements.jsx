
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import StudentHeader from '../components/StudentHeader';
import './StudentAnnouncements.css';

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [applicationCounts, setApplicationCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [availableTypes, setAvailableTypes] = useState([]);

  // Fetch user session and registrations
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchRegistrations(user.id);
      }
    };
    
    fetchUser();
  }, []);

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
      
      // Extract unique types from announcements
      if (data && data.length > 0) {
        const types = [...new Set(data.map(a => a.type))].sort();
        setAvailableTypes(types);
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

  // Fetch user's registrations
  const fetchRegistrations = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('announcement_id')
        .eq('student_id', userId);

      if (error) throw error;
      
      setRegistrations(data.map(r => r.announcement_id));
    } catch (err) {
      console.error('Registration fetch error:', err);
    }
  };

  // Handle registration
  const handleApply = async (announcementId) => {
    if (!user) {
      setError('Please log in to apply');
      return;
    }

    try {
      // Check if already registered
      if (registrations.includes(announcementId)) {
        setError('You have already applied to this announcement');
        return;
      }

      const { error } = await supabase
        .from('registrations')
        .insert([{
          student_id: user.id,
          announcement_id: announcementId,
          status: 'pending'
        }]);

      if (error) throw error;

      // Refresh registrations
      await fetchRegistrations(user.id);
    } catch (err) {
      console.error('Application error:', err);
      setError(err.message);
    }
  };

  // Handle contact
  const handleContact = (announcement) => {
    const creatorEmail = announcement.email;
    console.log('Creator Email:', creatorEmail);
    console.log('Full announcement object:', announcement);
    
    if (!creatorEmail) {
      setError('Contact information not available');
      return;
    }

    const subject = `Inquiry about: ${announcement.title}`;
    const body = `Hello,\n\nI'm interested in your announcement: "${announcement.title}"\n\nPlease provide more information about this opportunity.\n\nBest regards,\n[Your Name]`;
    
    const mailtoLink = `mailto:${creatorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    console.log('Mailto link:', mailtoLink);
    window.open(mailtoLink, '_blank');
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
          
          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-dropdown">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="type-filter"
              >
                <option value="">All Types</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading-spinner">Loading announcements...</div>
          ) : announcements.filter(announcement => {
            const lastDate = new Date(announcement.last_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return lastDate >= today;
          }).filter(announcement => {
            // Filter by search term
            const matchesSearch = searchTerm === '' || 
              announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Filter by type
            const matchesType = selectedType === '' || announcement.type === selectedType;
            
            return matchesSearch && matchesType;
          }).length === 0 ? (
            <p className="no-announcements">
              {searchTerm || selectedType ? 'No announcements match your search criteria.' : 'No active announcements available at the moment.'}
            </p>
          ) : (
            <div className="announcements-grid">
              {announcements
                .filter(announcement => {
                  const lastDate = new Date(announcement.last_date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return lastDate >= today;
                })
                .filter(announcement => {
                  // Filter by search term
                  const matchesSearch = searchTerm === '' || 
                    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
                  
                  // Filter by type
                  const matchesType = selectedType === '' || announcement.type === selectedType;
                  
                  return matchesSearch && matchesType;
                })
                .map(announcement => {
                  const lastDate = new Date(announcement.last_date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isExpired = lastDate < today;
                  const isRegistered = registrations.includes(announcement.id);
                  
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
                      
                      <div className="announcement-actions">
                        <button 
                          className={`apply-btn ${isRegistered ? 'applied' : ''}`}
                          onClick={() => handleApply(announcement.id)}
                          disabled={isExpired || isRegistered}
                        >
                          {isRegistered ? 'Applied ✓' : 'Apply Now'}
                        </button>
                        
                        <button 
                          className="contact-btn"
                          onClick={() => handleContact(announcement)}
                          disabled={isExpired}
                        >
                          Contact Creator
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