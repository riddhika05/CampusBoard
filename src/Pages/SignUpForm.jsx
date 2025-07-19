import React from 'react';
import './SignUpForm.css';

const SignUpForm = ({ onSwitchToLogin }) => (
  <form className="signup-form">
    <h2>Create Account</h2>
    <input
      type="text"
      placeholder="Full Name"
    />
    <input
      type="email"
      placeholder="Email"
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