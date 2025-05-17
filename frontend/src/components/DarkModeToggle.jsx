import React, { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import '../styles/DarkModeToggle.css';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <button 
      className="dark-mode-toggle" 
      onClick={toggleDarkMode}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      style={{ color: 'white' }} // Ensure icon color is white
    >
      {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
    </button>
  );
};

export default DarkModeToggle;