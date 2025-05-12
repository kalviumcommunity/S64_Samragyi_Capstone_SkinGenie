import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import ProductReview from './pages/ProductReview';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import QuizIntroPage from './pages/QuizIntroPage';
import RoutinePage from './pages/RoutinePage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected routes */}
        <Route
          path="/product-review"
          element={
            <PrivateRoute>
              <ProductReview />
            </PrivateRoute>
          }
        />
        <Route
          path="/routine"
          element={
            <PrivateRoute>
              <RoutinePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <QuizIntroPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz-page"
          element={
            <PrivateRoute>
              <QuizPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;