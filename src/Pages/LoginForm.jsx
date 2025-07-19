
import React, { useState } from 'react';
import './LoginForm.css';
import { logIn, logOut } from '../Services/Auth'; // adjust path if needed
import { useNavigate } from 'react-router-dom';
const LoginForm = ({ role, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { data, error } = await logIn(email, password);

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    const userRole = user?.user_metadata?.role;

    if (userRole !== role) {
      setErrorMsg(`Access denied: This is not a ${role} account.`);
      await logOut(); // optional: logout immediately
    } else {
      // ✅ Login successful
   
     
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
      window.location.reload();
      // You can redirect here or update parent component
    }

    setLoading(false);
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>{role === 'student' ? 'Student Login' : 'Admin Login'}</h2>

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

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <div className="switch-link">
        Don't have an account?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToSignUp();
          }}
        >
          Create one
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
