import React, { useState } from "react";
import styles from "./login.module.css";
import { loginUser, forgotPassword } from "../../services/authService.js";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/organicmulberrylogo.png";


export default function Login({ onLoginSuccess }) { // ✅ receive callback
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });

      if (response.data.success) {
        setMessage(response.data.message || "Login successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.user?.username || username);

        // ✅ tell App that login succeeded
        if (onLoginSuccess) onLoginSuccess();

        // ✅ navigate to default page
        navigate("/category");
      } else {
        setMessage("Invalid credentials!");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid credentials!");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(forgotUsername);
      alert(response.message || "Password reset successful! Check your email for the new password.");
      if (response.tempPassword) {
        alert(`Your temporary password is: ${response.tempPassword}\nPlease change it after logging in.`);
      }
      setShowForgotPassword(false);
      setForgotUsername("");
    } catch (error) {
      alert(error.response?.data?.message || "Error resetting password. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>

        {!showForgotPassword ? (
          <>
            <h2 className={styles.loginTitle}>Login</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Log In</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(true);
              }}
            >
              Forgot password?
            </a>
          </>
        ) : (
          <>
            <h2 className={styles.loginTitle}>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <input
                type="text"
                placeholder="Enter your username"
                value={forgotUsername}
                onChange={(e) => setForgotUsername(e.target.value)}
                required
              />
              <button type="submit">Reset Password</button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotUsername("");
                }}
                className={styles.cancelBtn}
              >
                Back to Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
