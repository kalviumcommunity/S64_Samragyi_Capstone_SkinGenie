import React from 'react';
import '../styles/LoginPage.css';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome Back !</h2>
        <p>Your skin deserves the best - and so do you.</p>
        <input type="email" placeholder="Your Mail Id" />
        <input type="password" placeholder="Password" />
        <button>LOGIN</button>
        <p className="signup-link">
          Don't have account yet? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
