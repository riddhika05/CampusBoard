import React, { useState } from 'react';
import './AdminDashBoard.css';
import Job from './PostType/Job';
import Intern from './PostType/Intern'
import Course from './PostType/Course'
import Webinar from './PostType/Webinar'
import Other from './PostType/Other'
import Training from './PostType/Training'
export default function AdminDashBoard() {
  const [form, setForm] = useState(false);

  const post_form = () => {
    setForm(true);
  };

  return (
    <div className="Post">
      <button onClick={post_form}>
        Make an Announcement!
      </button>
      {form && <PostForm />}
    </div>
  );
}

function PostForm() {
  const [postType, setPostType] = useState('');

  const handleTypeChange = (e) => {
    setPostType(e.target.value);
  };

  return (
    <form>
      <label htmlFor="postType">Type of Post:</label>
      <select
        id="postType"
        name="postType"
        value={postType}
        onChange={handleTypeChange}
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
      <>
        {postType === "job" && <Job />}
        {postType === "intern" && <Intern />}
        {postType === "course" && <Course />}
        {postType === "training" && <Training />}
        {postType === "webinar" && <Webinar />}
        {postType === "other" && <Other/>}
         
      </>
      
    </form>
  );
}

