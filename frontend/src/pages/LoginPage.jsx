import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../axios.config';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Both fields are required");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/login', {
        email: email.trim(),
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;
        if (token) {
          localStorage.setItem('token', token); // Store JWT token
          console.log('Stored JWT token:', localStorage.getItem('token'));
        }
        navigate('/quiz'); // Redirect after login
      }      
    } catch (err) {
      console.error("Login error:", err);
      const message = err.response?.data?.message || "An error occurred during login";
      setError(message);
    } finally {
      setLoading(false);
    }
  };
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
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <img src="/mail.png" alt="Mail Icon" className="input-icon" />
              <input
                type="email"
                placeholder="Your Mail Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <img src="/lock.png" alt="Lock Icon" className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>
          <p className="signup-link">
            Don't have an account yet? <Link to="/signup">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
