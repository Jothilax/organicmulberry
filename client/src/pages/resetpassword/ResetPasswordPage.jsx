import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    // Simulate password reset
    alert("Password reset successfully!");
    navigate("/login");
  };

  const isMismatch = confirm && password !== confirm;

  return (
    <div className="reset-container">
      <div className="reset-card">
        <div className="reset-header">
          <h2>Reset Password</h2>
          <p>Choose a strong new password</p>
        </div>

        <form className="reset-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <p className="hint">Minimum 6 characters</p>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className={isMismatch ? "error" : ""}
              required
            />
            {isMismatch && (
              <p className="error-text">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password || isMismatch}
            className="btn"
          >
            Reset Password
          </button>
        </form>

        <div className="back-link">
          <Link to="/login">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
