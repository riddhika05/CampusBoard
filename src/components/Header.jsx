import React from 'react'
import { Link } from 'react-router-dom';
import './Header.css'
export const Header = () => {
   return (
      <div className="header-container">
        <div className="header-title">CampusBoard</div>
         <ul className="header-list">
            <li>
               <Link to="/">Home</Link>
             </li>
             <li>
                 <Link to="/login" className='lgn-btn'>Login</Link>
             </li>
            
         </ul>
      </div>
   )
}
export  default Header;
