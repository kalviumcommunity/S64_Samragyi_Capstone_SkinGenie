import React, { useState } from 'react';
import '../styles/Navbar.css'; // Updated import path

function Navbar() {
  const [activeItem, setActiveItem] = useState('HOME');
  const menuItems = ['HOME', 'ABOUT US', 'PRODUCT REVIEW', 'QUIZ'];

  return (
    <div className="container">
      <nav className="navbar">
        <div className="menu">
          {menuItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveItem(item)}
              className={activeItem === item ? 'menu-item active' : 'menu-item'}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
      <div className="content">
        <h1>Welcome to SkinGenie</h1>
        <p>Your personalized skincare companion.</p>
      </div>
    </div>
  );
}

export default Navbar;
