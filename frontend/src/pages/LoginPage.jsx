import React, { useState, useEffect } from 'react';
import '../styles/LoginPage.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../axios.config';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Google OAuth token handler
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const authError = params.get('error');
    
    // Handle authentication errors
    if (authError) {
      let errorMessage = 'Authentication failed';
      switch (authError) {
        case 'auth_failed':
          errorMessage = 'Google authentication failed. Please try again.';
          break;
        case 'no_user':
          errorMessage = 'Unable to retrieve user information from Google.';
          break;
        case 'callback_error':
          errorMessage = 'An error occurred during authentication. Please try again.';
          break;
        default:
          errorMessage = 'Authentication failed. Please try again.';
      }
      setError(errorMessage);
      return;
    }
    
    if (token) {
      localStorage.setItem('token', token);
      
      // If userId is provided in the URL, store it
      if (userId) {
        localStorage.setItem('userId', userId);
      } else {
        // Try to extract userId from the JWT token
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (payload.userId) {
              localStorage.setItem('userId', payload.userId);
            }
          }
        } catch (error) {
          console.error('Error extracting user ID from token:', error);
          setError('Invalid authentication token. Please try logging in again.');
          return;
        }
      }
      
      navigate('/quiz');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Both fields are required");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/login', {
        email: email.trim(),
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        if (token) {
          localStorage.setItem('token', token); // Store JWT token
        }
        if (user && user.id) {
          localStorage.setItem('userId', user.id); // Store user ID
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

          {/* Google Login Button */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <a
              href={`${import.meta.env.VITE_API_URL}/auth/google`}
              className="google-login-btn"
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
                onError={e => { e.target.style.display = 'none'; }}
              />
              Login with Google
            </a>
          </div>

          <p className="signup-link">
            Don't have an account yet? <Link to="/signup">Signup</Link>
          </p>
          <p className="forgot-password-link">
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;