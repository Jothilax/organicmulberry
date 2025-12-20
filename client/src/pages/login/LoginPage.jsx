 import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService.js"; // ✅ adjust path if needed
import "./LoginPage.css";

const LoginPage = () => {
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // 🖱 Track Mouse Movement for avatar animation
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({
          x: Math.min(Math.max(x, 10), 90),
          y: Math.min(Math.max(y, 10), 90),
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 🧠 Handle Login Submit using authService
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact) return alert("Please enter your email or phone number");

    setIsLoading(true);
    try {
      // Prepare values for request
      const email = contact.includes("@") ? contact : null;
      const phone = !contact.includes("@") ? contact : null;

      // ✅ Call your service
      const response = await authService.requestOTP(email, phone);

      alert(response.message || "OTP sent successfully");
      navigate("/otpverify", { state: { contact } });
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="login-container">
      <div className="login-card">
        {/* Avatar */}
        <div className="avatar-wrapper">
          <div className="avatar">
            <div className="eye left-eye">
              <div
                className="pupil"
                style={{
                  transform: `translate(${(mousePosition.x - 50) * 0.08}px, ${
                    (mousePosition.y - 50) * 0.08
                  }px)`,
                }}
              ></div>
            </div>
            <div className="eye right-eye">
              <div
                className="pupil"
                style={{
                  transform: `translate(${(mousePosition.x - 50) * 0.08}px, ${
                    (mousePosition.y - 50) * 0.08
                  }px)`,
                }}
              ></div>
            </div>
            <div className="mouth"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in with Email or Phone Number</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email / Phone Number</label>
            <input
              type="text"
              placeholder="Enter your email or phone number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : "Send OTP"}
          </button>
        </form>

        {/* Optional Signup Link */}
        {/* 
        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/register" className="signup-link">
            Create Account
          </Link>
        </p>
        */}
      </div>
    </div>
  );
};

export default LoginPage;
