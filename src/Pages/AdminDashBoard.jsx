import React, { useState } from 'react';
import './AdminDashBoard.css';

export default function AdminDashBoard() {
  const [form, setForm] = useState(false);

  const post_form = () => {
    setForm(true);
  };
  const close_form = () => {
    setForm(false);
  };

  return (
    <>
      {form && <div className="post-modal-overlay"></div>}
      {form && <div className="Post">
        <div className="announcement-modal-overlay"></div>
        <AnnouncementForm onClose={close_form} />
      </div>}
      {!form && (
        <div className="Post">
          <button onClick={post_form}>
            Make an Announcement!
          </button>
        </div>
      )}
    </>
  );
}

function AnnouncementForm({ onClose }) {
  const [postType, setPostType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [duration, setDuration] = useState('');
  const [video, setVideo] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [webinarLink, setWebinarLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <form className="announcement-form" onSubmit={handleSubmit} style={{marginTop: '1.5rem', position: 'relative'}}>
      <button type="button" className="training-modal-close" onClick={onClose}>×</button>
      <label htmlFor="postType">Type of Post*:</label>
      <select
        id="postType"
        name="postType"
        value={postType}
        onChange={e => setPostType(e.target.value)}
        required
      >
        <option value="">Select type</option>
        <option value="job">Job Opportunity</option>
        <option value="intern">Intern Opportunity</option>
        <option value="course">Course Announcement</option>
        <option value="training">Training Session</option>
        <option value="webinar">Webinar</option>
        <option value="other">Other</option>
      </select>
      <label>
        Title*:
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
      </label>
      <label>
        Description*:
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />
      </label>
      <label>
        Last Date to Apply*:
        <input type="date" value={lastDate} onChange={e => setLastDate(e.target.value)} required />
      </label>
      <label>
        Duration*:
        <input type="text" value={duration} onChange={e => setDuration(e.target.value)} required placeholder="e.g. 2 weeks, 3 months" />
      </label>
      {postType === 'webinar' && (
        <label>
          Live Webinar Link*:
          <input type="url" value={webinarLink} onChange={e => setWebinarLink(e.target.value)} required />
        </label>
      )}
      <label>
        Video Upload (optional):
        <input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} />
      </label>
      <label>
        Photo Upload (optional):
        <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
      </label>
      <button type="submit">Submit Announcement</button>
    </form>
  );
}

