import React from 'react';
import './SignUpForm.css';

const SignUpForm = ({ role, onSwitchToLogin }) => (
  <form className="signup-form">
    <h2>Create {role === 'student' ? 'Student' : 'Admin'} Account</h2>
    <input
      type="text"
      placeholder={role === 'student' ? 'Full Name (Student)' : 'Full Name (Admin)'}
    />
    <input
      type="email"
      placeholder={role === 'student' ? 'Student Email' : 'Admin Email'}
    />
    <input
      type="password"
      placeholder="Password"
    />
    <input
      type="password"
      placeholder="Confirm Password"
    />
    <button type="submit">
      Create Account
    </button>
    <div className="switch-link">
      Already have an account?{' '}
      <a
        href="#"
        onClick={e => { e.preventDefault(); onSwitchToLogin(); }}
      >
        Login
      </a>
    </div>
  </form>
);

export default SignUpForm; 