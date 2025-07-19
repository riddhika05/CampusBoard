import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import './LoginModal.css';
import Home from './Home';
const Login = () => {
  const [showModal, setShowModal] = useState(true);
  const [role, setRole] = useState('student');
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login') {
      setShowModal(true);
    }
  }, [location.pathname]);

  const closeModal = () => setShowModal(false);

  return (
    <>
    <Home/>
    <div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>×</button>
            {mode === 'login' ? (
              <>
                <div className="role-switch">
                  <button
                    className={role === 'student' ? 'role-btn active' : 'role-btn'}
                    onClick={() => setRole('student')}
                  >
                    Student
                  </button>
                  <button
                    className={role === 'admin' ? 'role-btn active' : 'role-btn'}
                    onClick={() => setRole('admin')}
                  >
                    Admin
                  </button>
                </div>
                <LoginForm role={role} onSwitchToSignUp={() => setMode('register')} />
              </>
            ) : (
              <SignUpForm onSwitchToLogin={() => setMode('login')} />
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Login;
