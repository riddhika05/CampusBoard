import React, { useState } from 'react';
import './AdminDashBoard.css';
import AnnouncementForm from './AnnouncementForm';
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
              <div className="admin-header"> 
          <ul>
            <li onClick={post_form}>
                Post Announcements!
            </li>
          </ul>
        </div>
      {/* {form && <div className="post-modal-overlay"></div>} */}
      {form && 
      (<>
        <div className="announcement-modal-overlay"></div>
        <AnnouncementForm onClose={close_form} />
        </>
      )
      }
            
    </>
  );
}

