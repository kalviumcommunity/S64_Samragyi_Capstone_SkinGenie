import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../axios.config";
import { toast } from "react-toastify";
import "../styles/AuthForms.css";

const ResetPasswordPage = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [step, setStep] = useState(1); // 1: OTP verification, 2: New password, 3: Success
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Get userId from localStorage (set during the forgot password flow)
    const id = localStorage.getItem("resetUserId");
    
    if (!id) {
      toast.error("Password reset session expired. Please request a new password reset.");
      navigate("/forgot-password");
    } else {
      setUserId(id);
    }
  }, [navigate]);
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error("Please enter the OTP sent to your email");
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post("/api/password-reset/verify-otp", { 
        userId, 
        otp 
      });
      
      // Move to password reset step
      setStep(2);
      toast.success("OTP verified successfully");
      
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Please enter and confirm your new password");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post("/api/password-reset/reset", {
        userId,
        otp,
        newPassword
      });
      
      // Move to success step
      setStep(3);
      toast.success("Password reset successful");
      
      // Clear the resetUserId from localStorage
      localStorage.removeItem("resetUserId");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(error.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Reset Your Password</h2>
        
        {step === 1 && (
          <>
            <p className="auth-description">
              Enter the verification code sent to your email.
            </p>
            
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div className="form-group">
                <label htmlFor="otp">Verification Code (OTP)</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          </>
        )}
        
        {step === 2 && (
          <>
            <p className="auth-description">
              Create a new password for your account.
            </p>
            
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength={6}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={6}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
        
        {step === 3 && (
          <div className="success-message">
            <p>
              Your password has been reset successfully!
            </p>
            <p>
              You will be redirected to the login page in a few seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
