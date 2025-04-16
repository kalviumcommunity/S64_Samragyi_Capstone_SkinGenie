import React from 'react';
import '../styles/AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us-container">
      <h1>About Us</h1>
      <div className="content-grid">
        <div className="feature">
          <img src="/cube.png" alt="Smart Skin Analysis" />
          <h3>Smart Skin Analysis</h3>
          <p>Start with our 2-minute quiz to discover your true skin type—no more guesswork.</p>
        </div>
        <div className="feature">
          <img src="/cube.png" alt="Progress Tracking" />
          <h3>Progress Tracking:</h3>
          <p>Log daily habits and visualize your skincare journey.</p>
        </div>
        <div className="feature">
          <img src="/cube.png" alt="Personalized Routines" />
          <h3>Personalized Routines</h3>
          <p>Get a tailored regimen that evolves with your skin's progress, from beginner to pro.</p>
        </div>
        <div className="feature">
          <img src="/cube.png" alt="Honest Reviews" />
          <h3>Honest Reviews</h3>
          <p>Real user feedback on trending products—no sponsored bias.</p>
        </div>
      </div>
      <div className="center-image">
        <img src="/centreImageAboutUs.jpeg" alt="Skincare Products" />
      </div>
    </div>
  );
}

export default AboutUs;
