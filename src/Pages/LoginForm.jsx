import React from 'react';
import './LoginForm.css';

const LoginForm = ({ role, onSwitchToSignUp }) => (
  <form className="login-form">
    <h2>
      {role === 'student' ? 'Student Login' : 'Admin Login'}
    </h2>
    <input
      type="email"
      placeholder={role === 'student' ? 'Student Email' : 'Admin Email'}
    />
    <input
      type="password"
      placeholder="Password"
    />
    <button type="submit">
      Login
    </button>
    <div className="switch-link">
      Don't have an account?{' '}
      <a
        href="#"
        onClick={e => { e.preventDefault(); onSwitchToSignUp(); }}
      >
        Create one
      </a>
    </div>
  </form>
);

export default LoginForm; 