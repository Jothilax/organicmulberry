import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [method, setMethod] = useState("phone");
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/otpverify", { state: { method, value } });
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <div className="forgot-header">
          <h2>Forgot Password</h2>
          <p>We’ll send an OTP to verify your identity</p>
        </div>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="method-switch">
            <button
              type="button"
              className={method === "phone" ? "active" : ""}
              onClick={() => setMethod("phone")}
            >
              Phone
            </button>
            <button
              type="button"
              className={method === "email" ? "active" : ""}
              onClick={() => setMethod("email")}
            >
              Email
            </button>
          </div>

          {method === "phone" ? (
            <div className="input-group">
              <label>Mobile Number</label>
              <div className="phone-input">
                <span>+91</span>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            Send OTP
          </button>
        </form>

        <div className="forgot-footer">
          <Link to="/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
