import React from 'react';
import '../styles/HomePage.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="main-content">
        <div className="content-container">
          <div className="text-content">
            <h1>SkinGenie</h1>
            <p>
              Your intelligent skincare companion that revolutionizes personalized skincare routines. Designed for both beginners and enthusiasts, SkinGenie starts with a quick quiz to analyze your unique skin type and concerns, then generates a tailored routine that progresses from basic cleansing to advanced treatments. Track your daily progress, explore honest reviews from real users, and engage with a supportive skincare community—all in one place. Say goodbye to guesswork and hello to healthier, happier skin with SkinGenie – where science meets self-care.
            </p>
            <Link to="/signup">
              <button>GET STARTED</button>
            </Link>
          </div>
          <div className="image-container">
            <img src="/model.png" alt="Skincare Model" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
