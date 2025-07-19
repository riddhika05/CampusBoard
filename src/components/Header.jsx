
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { logOut, getSession } from '../Services/Auth';

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data } = await getSession();
    if (data?.session?.user) {
      setIsLoggedIn(true);
      setUserRole(data.session.user.user_metadata?.role);
    }
  };

  const handleLogout = async () => {
    const { error } = await logOut();
    if (!error) {
      setIsLoggedIn(false);
      setUserRole(null);
      navigate('/');
    }
  };

  return (
    <div className="header-container">
      <div className="header-title">CampusBoard</div>
      <ul className="header-list">
        <li>
          <Link to="/">Home</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <span className="user-role">{userRole}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="lgn-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" className="lgn-btn">
              Login
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;