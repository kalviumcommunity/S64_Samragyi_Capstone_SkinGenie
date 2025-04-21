import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
function Navbar() {
  const navigate = useNavigate();
  const menuItems = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'PRODUCT REVIEW', path: '/product-review' },
    { name: 'QUIZ', path: '/quiz' },
  ];
  const isLoggedIn = () => {
    // Check if the user is logged in (e.g., check if a token exists in localStorage)
    return localStorage.getItem('token') !== null;
  };
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };
  return (
    <div className="container">
      <nav className="navbar">
        <div className='logo'>
          <img src="\logo.png" alt="SkinGenie Logo" className="logo-icon" />
        </div>
        <div className="menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className="menu-item"
              activeClassName="active"
            >
              {item.name}
            </NavLink>
          ))}
          {isLoggedIn() && (
            <button onClick={handleLogout} className="logout-button">
              LOGOUT
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
