// // import React, { useState } from 'react';
// // import './AnnouncementForm.css';

// // export default function AnnouncementForm({ onClose }) {
// //   const [postType, setPostType] = useState('');
// //   const [title, setTitle] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [lastDate, setLastDate] = useState('');
// //   const [duration, setDuration] = useState('');
// //   const [video, setVideo] = useState(null);
// //   const [photo, setPhoto] = useState(null);
// //   const [webinarLink, setWebinarLink] = useState('');

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     // Handle form submission logic here
// //     console.log('Form submitted:', {
// //       postType,
// //       title,
// //       description,
// //       lastDate,
// //       duration,
// //       webinarLink,
// //       video,
// //       photo
// //     });
// //   };

// //   return (
// //     <form className="announcement-form" onSubmit={handleSubmit}>
// //       <button type="button" className="announcement-modal-close" onClick={onClose}>×</button>
        
// //         <label htmlFor="postType">Type of Post*:</label>
// //         <select
// //           id="postType"
// //           name="postType"
// //           value={postType}
// //           onChange={e => setPostType(e.target.value)}
// //           required
// //         >
// //           <option value="">Select type</option>
// //           <option value="job">Job Opportunity</option>
// //           <option value="intern">Intern Opportunity</option>
// //           <option value="course">Course Announcement</option>
// //           <option value="training">Training Session</option>
// //           <option value="webinar">Webinar</option>
// //           <option value="other">Other</option>
// //         </select>
        
// //         <label>
// //           Title*:
// //           <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
// //         </label>
        
// //         <label>
// //           Description*:
// //           <textarea value={description} onChange={e => setDescription(e.target.value)} required />
// //         </label>
        
// //         <label>
// //           Last Date to Apply*:
// //           <input type="date" value={lastDate} onChange={e => setLastDate(e.target.value)} required />
// //         </label>
        
// //         <label>
// //           Duration*:
// //           <input type="text" value={duration} onChange={e => setDuration(e.target.value)} required placeholder="e.g. 2 weeks, 3 months" />
// //         </label>
        
// //         {postType === 'webinar' && (
// //           <label>
// //             Live Webinar Link*:
// //             <input type="url" value={webinarLink} onChange={e => setWebinarLink(e.target.value)} required />
// //           </label>
// //         )}
        
// //         <label>
// //           Video Upload (optional):
// //           <input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} />
// //         </label>
        
// //         <label>
// //           Photo Upload (optional):
// //           <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
// //         </label>
        
// //         <button type="submit">Submit Announcement</button>
// //       </form>
// //   );
// // }  
// import React, { useState } from 'react';
// import { supabase } from '../supabaseClient'; // Adjust path to your supabase client
// import './AnnouncementForm.css';

// export default function AnnouncementForm({ onClose }) {
//   const [formData, setFormData] = useState({
//     postType: '',
//     title: '',
//     description: '',
//     lastDate: '',
//     duration: '',
//     webinarLink: '',
//     video: null,
//     photo: null
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
//   };

//   const uploadFile = async (file, fileType) => {
//     if (!file) return null;
    
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Date.now()}.${fileExt}`;
//     const filePath = `${fileType}/${fileName}`;

//     const { error } = await supabase.storage
//       .from('announcements')
//       .upload(filePath, file);

//     if (error) throw error;

//     return supabase.storage
//       .from('announcements')
//       .getPublicUrl(filePath).data.publicUrl;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       // Upload files if they exist
//       const [videoUrl, photoUrl] = await Promise.all([
//         uploadFile(formData.video, 'videos'),
//         uploadFile(formData.photo, 'photos')
//       ]);

//       // Insert announcement data
//       const { data, error } = await supabase
//         .from('announcements')
//         .insert([{
//           type: formData.postType,
//           title: formData.title,
//           description: formData.description,
//           last_date: formData.lastDate,
//           duration: formData.duration,
//           webinar_link: formData.webinarLink,
//           video_url: videoUrl,
//           photo_url: photoUrl,
//           created_at: new Date().toISOString(),
//           status: 'published'
//         }])
//         .select();

//       if (error) throw error;

//       alert('Announcement published successfully!');
//       onClose();
//     } catch (err) {
//       console.error('Error:', err);
//       setError(err.message || 'Failed to publish announcement');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form className="announcement-form" onSubmit={handleSubmit}>
//       <button 
//         type="button" 
//         className="announcement-modal-close" 
//         onClick={onClose}
//         disabled={isLoading}
//       >
//         ×
//       </button>

//       <label htmlFor="postType">Type of Post*:</label>
//       <select
//         id="postType"
//         name="postType"
//         value={formData.postType}
//         onChange={handleChange}
//         required
//         disabled={isLoading}
//       >
//         <option value="">Select type</option>
//         <option value="job">Job Opportunity</option>
//         <option value="intern">Intern Opportunity</option>
//         <option value="course">Course Announcement</option>
//         <option value="training">Training Session</option>
//         <option value="webinar">Webinar</option>
//         <option value="other">Other</option>
//       </select>

//       <label>
//         Title*:
//         <input 
//           type="text" 
//           name="title"
//           value={formData.title} 
//           onChange={handleChange} 
//           required 
//           disabled={isLoading}
//         />
//       </label>

//       <label>
//         Description*:
//         <textarea 
//           name="description"
//           value={formData.description} 
//           onChange={handleChange} 
//           required 
//           disabled={isLoading}
//         />
//       </label>

//       <label>
//         Last Date to Apply*:
//         <input 
//           type="date" 
//           name="lastDate"
//           value={formData.lastDate} 
//           onChange={handleChange} 
//           required 
//           disabled={isLoading}
//         />
//       </label>

//       <label>
//         Duration*:
//         <input 
//           type="text" 
//           name="duration"
//           value={formData.duration} 
//           onChange={handleChange} 
//           required 
//           placeholder="e.g. 2 weeks, 3 months"
//           disabled={isLoading}
//         />
//       </label>

//       {formData.postType === 'webinar' && (
//         <label>
//           Live Webinar Link*:
//           <input 
//             type="url" 
//             name="webinarLink"
//             value={formData.webinarLink} 
//             onChange={handleChange} 
//             required 
//             disabled={isLoading}
//           />
//         </label>
//       )}

//       <label>
//         Video Upload (optional):
//         <input 
//           type="file" 
//           name="video"
//           accept="video/*" 
//           onChange={handleFileChange} 
//           disabled={isLoading}
//         />
//       </label>

//       <label>
//         Photo Upload (optional):
//         <input 
//           type="file" 
//           name="photo"
//           accept="image/*" 
//           onChange={handleFileChange} 
//           disabled={isLoading}
//         />
//       </label>

//       {error && <div className="error-message">{error}</div>}

//       <button type="submit" disabled={isLoading}>
//         {isLoading ? 'Publishing...' : 'Submit Announcement'}
//       </button>
//     </form>
//   );
// }
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './AnnouncementForm.css';

export default function AnnouncementForm({ onClose }) {
  const [formData, setFormData] = useState({
    postType: '',
    title: '',
    description: '',
    lastDate: '',
    duration: '',
    webinarLink: '',
    video: null,
    photo: null
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
      // 1. Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error(userError?.message || 'User not authenticated');
      }

      // 2. Upload files if they exist
      const [videoUrl, photoUrl] = await Promise.all([
        uploadFile(formData.video, 'videos'),
        uploadFile(formData.photo, 'photos')
      ]);

      // 3. Insert announcement data with user reference
      const { data, error: insertError } = await supabase
        .from('announcements')
        .insert({
          user_id: user.id, // Add user reference
          type: formData.postType,
          title: formData.title,
          description: formData.description,
          last_date: formData.lastDate || null, // Handle empty date
          duration: formData.duration,
          webinar_link: formData.postType === 'webinar' ? formData.webinarLink : null,
          video_url: videoUrl,
          photo_url: photoUrl,
          status: 'published'
        })
        .select();

      if (insertError) throw insertError;

      alert('Announcement published successfully!');
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

      <div className="form-group">
        <label>
          Photo Upload (optional):
          <input 
            type="file" 
            name="photo"
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={isLoading}
          />
          {formData.photo && (
            <span className="file-info">{formData.photo.name}</span>
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
              Publishing...
            </>
          ) : (
            'Submit Announcement'
          )}
        </button>
      </div>
    </form>
  );
}