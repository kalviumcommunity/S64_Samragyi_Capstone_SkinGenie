import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import ProductReview from './pages/ProductReview';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RoutinePage from './pages/RoutinePage';
import CommunityPage from './pages/CommunityPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/product-review" element={<ProductReview />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
