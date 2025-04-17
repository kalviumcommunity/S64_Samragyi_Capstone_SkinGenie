import React from 'react';
import '../styles/SignupPage.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import Navbar

function SignupPage() {
  return (
    <div className="signup-outer-container">
      <Navbar /> {/* Include the Navbar component here */}
      <div className="signup-box">
        <div className="signup-image-section">
          <img src="/signuppic.jpeg" alt="Skincare" className="signup-image" />
        </div>
        <div className="signup-form">
          <h2>We're glowing to see you here!</h2>
          <p>Your best skin begins with one click.</p>
          <div className="input-container">
            <img src="/mail.png" alt="Mail Icon" className="input-icon" />
            <input type="email" placeholder="Your Mail Id" />
          </div>
          <div className="input-container">
            <img src="/lock.png" alt="Lock Icon" className="input-icon" />
            <input type="password" placeholder="Password" />
          </div>
          <div className="input-container">
            <img src="/lock.png" alt="Lock Icon" className="input-icon" />
            <input type="password" placeholder="Confirm Password" />
          </div>
          <button>SIGNUP</button>
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
