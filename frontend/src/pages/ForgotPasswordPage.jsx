import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios.config";
import { toast } from "react-toastify";
import "../styles/AuthForms.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email form, 2: Success message
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    
    try {
      // Send password reset request
      const response = await axios.post("/api/password-reset/request", { email });
      
      // Store userId for the next step
      if (response.data && response.data.userId) {
        localStorage.setItem("resetUserId", response.data.userId);
      }
      
      // Move to success step
      setStep(2);
      toast.success("Password reset instructions sent to your email");
      
    } catch (error) {
      console.error("Password reset request error:", error);
      toast.error(error.response?.data?.message || "Failed to send reset instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Reset Your Password</h2>
        
        {step === 1 ? (
          <>
            <p className="auth-description">
              Enter your email address and we will send you instructions to reset your password.
            </p>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Instructions"}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <p>
              If your email address exists in our database, you will receive a password recovery code at your email address shortly.
            </p>
            <p>
              Please check your email and follow the instructions to reset your password.
            </p>
            <button 
              onClick={() => navigate("/reset-password")} 
              className="auth-button"
              style={{ marginTop: "20px", width: "100%" }}
            >
              Continue to Reset Password
            </button>
          </div>
        )}
        
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};


export default ForgotPasswordPage;
