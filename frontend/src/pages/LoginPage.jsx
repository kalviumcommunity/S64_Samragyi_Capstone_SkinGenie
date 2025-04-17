import React from 'react';
import '../styles/LoginPage.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function LoginPage() {
  return (
    <div className="login-outer-container">
      <Navbar />
      <div className="login-box">
        <div className="login-image-section">
          <img src="/loginpic.jpeg" alt="Skincare" className="login-image" />
        </div>
        <div className="login-form">
          <h2>Welcome Back !</h2>
          <p>Your skin deserves the best - and so do you.</p>
          <div className="input-container">
            <img src="/mail.png" alt="Mail Icon" className="input-icon" />
            <input type="email" placeholder="Your Mail Id" />
          </div>
          <div className="input-container">
            <img src="/lock.png" alt="Lock Icon" className="input-icon" />
            <input type="password" placeholder="Password" />
          </div>
          <button>LOGIN</button>
          <p className="signup-link">
            Don't have an account yet? <Link to="/signup">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
