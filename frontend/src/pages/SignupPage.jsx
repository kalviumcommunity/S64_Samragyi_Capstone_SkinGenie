import React, { useState } from 'react';
import '../styles/SignupPage.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../axios.config';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/signup', {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/quiz');
      } else if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Signup error:', err);
      const message =
        err.response?.data?.message || 'An error occurred during signup';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="signup-outer-container">
      <Navbar />
      <div className="signup-box">
        <div className="signup-image-section">
          <img src="/signuppic.jpeg" alt="Signup Visual" className="signup-image" />
        </div>
        <div className="signup-form">
          <h2>We're glowing to see you here!</h2>
          <p>Your best skin begins with one click.</p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <img src="/user.png" alt="User Icon" className="input-icon" />
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={handleInputChange(setName)}
                autoComplete="name"
                required
              />
            </div>
            <div className="input-container">
              <img src="/mail.png" alt="Mail Icon" className="input-icon" />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={handleInputChange(setEmail)}
                autoComplete="email"
                required
              />
            </div>
            <div className="input-container">
              <img src="/lock.png" alt="Password Icon" className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handleInputChange(setPassword)}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="input-container">
              <img src="/lock.png" alt="Confirm Password Icon" className="input-icon" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
                autoComplete="new-password"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'SIGNUP'}
            </button>
          </form>

          {/* Google Signup Button */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <a
              href="http://localhost:8000/auth/google"
              className="google-signup-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                color: '#444',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '8px 16px',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              <img
                src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
                alt="Google icon"
                style={{ width: 20, height: 20, marginRight: 8 }}
              />
              Sign up with Google
            </a>
          </div>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
