
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './AnnouncementForm.css';

export default function AnnouncementForm({ onClose, editingAnnouncement }) {
  const [formData, setFormData] = useState({
    postType: editingAnnouncement?.type || '',
    title: editingAnnouncement?.title || '',
    description: editingAnnouncement?.description || '',
    lastDate: editingAnnouncement?.last_date ? editingAnnouncement.last_date.split('T')[0] : '',
    duration: editingAnnouncement?.duration || '',
    webinarLink: editingAnnouncement?.webinar_link || '',
    email: editingAnnouncement?.email || '',
    video: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const uploadFile = async (file, fileType) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileType}/${fileName}`;

    const { error } = await supabase.storage
      .from('announcements')
      .upload(filePath, file);

    if (error) throw error;

    return supabase.storage
      .from('announcements')
      .getPublicUrl(filePath).data.publicUrl;
  };

     const handleSubmit = async (e) => {
     e.preventDefault();
     setIsLoading(true);
     setError('');

     try {
       // Validate that the last date is after today
       const selectedDate = new Date(formData.lastDate);
       const today = new Date();
       today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
       
       if (selectedDate <= today) {
         throw new Error('Last date to apply must be after today');
       }

       // 1. Get current user
       const { data: { user }, error: userError } = await supabase.auth.getUser();
       
       if (userError || !user) {
         throw new Error(userError?.message || 'User not authenticated');
       }

             // 2. Upload video if it exists
       const videoUrl = await uploadFile(formData.video, 'videos');

             // 3. Insert or update announcement data with user reference
       let result;
       if (editingAnnouncement) {
         // Update existing announcement
         result = await supabase
           .from('announcements')
           .update({
             type: formData.postType,
             title: formData.title,
             description: formData.description,
             last_date: formData.lastDate || null,
             duration: formData.duration,
             webinar_link: formData.postType === 'webinar' ? formData.webinarLink : null,
             email: formData.email,
             video_url: videoUrl || editingAnnouncement.video_url
           })
           .eq('id', editingAnnouncement.id)
           .select();
       } else {
         // Insert new announcement
         result = await supabase
           .from('announcements')
           .insert({
             user_id: user.id,
             type: formData.postType,
             title: formData.title,
             description: formData.description,
             last_date: formData.lastDate || null,
             duration: formData.duration,
             webinar_link: formData.postType === 'webinar' ? formData.webinarLink : null,
             email: formData.email,
             video_url: videoUrl,
             status: 'published'
           })
           .select();
       }

       const { data, error: insertError } = result;

      if (insertError) throw insertError;

      onClose();
    } catch (err) {
      console.error('Submission Error:', err);
      setError(err.message || 'Failed to publish announcement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="announcement-form" onSubmit={handleSubmit}>
      <button 
        type="button" 
        className="announcement-modal-close" 
        onClick={onClose}
        disabled={isLoading}
        aria-label="Close form"
      >
        ×
      </button>

      <div className="form-group">
        <label htmlFor="postType">Type of Post*:</label>
        <select
          id="postType"
          name="postType"
          value={formData.postType}
          onChange={handleChange}
          required
          disabled={isLoading}
        >
          <option value="">Select type</option>
          <option value="job">Job Opportunity</option>
          <option value="intern">Intern Opportunity</option>
          <option value="course">Course Announcement</option>
          <option value="training">Training Session</option>
          <option value="webinar">Webinar</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          Title*:
          <input 
            type="text" 
            name="title"
            value={formData.title} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            placeholder="Enter announcement title"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Description*:
          <textarea 
            name="description"
            value={formData.description} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            placeholder="Provide detailed information"
            rows={5}
          />
        </label>
      </div>

             <div className="form-group">
          <label>
            Last Date to Apply:
            <input 
              type="date" 
              name="lastDate"
              value={formData.lastDate} 
              onChange={handleChange} 
              disabled={isLoading}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              required
            />
          </label>
        </div>

      <div className="form-group">
        <label>
          Duration*:
          <input 
            type="text" 
            name="duration"
            value={formData.duration} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            placeholder="e.g., 2 weeks, 3 months"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Contact Email*:
          <input 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            placeholder="your.email@example.com"
          />
        </label>
      </div>

      {formData.postType === 'webinar' && (
        <div className="form-group">
          <label>
            Live Webinar Link*:
            <input 
              type="url" 
              name="webinarLink"
              value={formData.webinarLink} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
              placeholder="https://example.com/webinar"
            />
          </label>
        </div>
      )}

      <div className="form-group">
        <label>
          Video Upload (optional):
          <input 
            type="file" 
            name="video"
            accept="video/*" 
            onChange={handleFileChange} 
            disabled={isLoading}
          />
          {formData.video && (
            <span className="file-info">{formData.video.name}</span>
          )}
        </label>
      </div>



      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="form-actions">
        <button 
          type="submit" 
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              {editingAnnouncement ? 'Updating...' : 'Publishing...'}
            </>
          ) : (
            editingAnnouncement ? 'Update Announcement' : 'Submit Announcement'
          )}
        </button>
      </div>
    </form>
  );
}