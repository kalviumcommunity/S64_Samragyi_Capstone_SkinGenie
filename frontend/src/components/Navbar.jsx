import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const menuItems = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'PRODUCT REVIEW', path: '/product-review' },
    { name: 'QUIZ', path: '/quiz' },
  ];

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
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
