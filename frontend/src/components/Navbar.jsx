import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import ThemeContext from '../context/ThemeContext';
import '../styles/Navbar.css'; // Import the CSS file

function Navbar() {
    const navigate = useNavigate();
    const { darkMode } = useContext(ThemeContext);
    const menuItems = [
        { name: 'HOME', path: '/' },
        { name: 'ABOUT US', path: '/about' },
        { name: 'PRODUCT REVIEW', path: '/product-review' },
        { name: 'QUIZ', path: '/quiz' },
    ];

    const isLoggedIn = () => {
        return localStorage.getItem('token') !== null;
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div id="navbar-container"> {/* Use an ID for the main container */}
            <nav id="navbar"> {/* Use an ID for the navbar */}
                <div id="logo">
                    <img src="\logo.png" alt="SkinGenie Logo" id="logo-icon" />
                </div>
                <div id="menu">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            id={`menu-item-${item.name.toLowerCase().replace(' ', '-')}`} // Dynamic ID for each menu item
                        >
                            {item.name}
                        </NavLink>
                    ))}
                    {isLoggedIn() && (
                        <button onClick={handleLogout} id="logout-button">LOGOUT</button>
                    )}
                    <DarkModeToggle />
                </div>
            </nav>
        </div>
    );
}

export default Navbar;