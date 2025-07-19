
import React, { useState } from 'react';
import './SignUpForm.css';
import { signUp } from '../Services/Auth'; // adjust the path if needed
import { useNavigate } from 'react-router-dom';
const SignUpForm = ({ role, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    const { data, error } = await signUp(email, password, role);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(`Account created! Please verify your email.`);
      // optionally clear form
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
      window.location.reload();
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }

    setLoading(false);
  };

  return (
    <form className="signup-form" onSubmit={handleSignUp}>
      <h2>Create {role === 'student' ? 'Student' : 'Admin'} Account</h2>

      <input
        type="text"
        placeholder={role === 'student' ? 'Full Name (Student)' : 'Full Name (Admin)'}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder={role === 'student' ? 'Student Email' : 'Admin Email'}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Account'}
      </button>

      {errorMsg && <p className="error">{errorMsg}</p>}
      {successMsg && <p className="success">{successMsg}</p>}

      <div className="switch-link">
        Already have an account?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToLogin();
          }}
        >
          Login
        </a>
      </div>
    </form>
  );
};

export default SignUpForm;
