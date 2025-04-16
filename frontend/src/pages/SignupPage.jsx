import React from 'react';
import '../styles/SignupPage.css';
import { Link } from 'react-router-dom';

function SignupPage() {
  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>We're glowing to see you here!</h2>
        <p>Your best skin begins with one click.</p>
        <input type="email" placeholder="Your Mail Id" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <button>SIGNUP</button>
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
