import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import "./OtpVerificationPage.css";

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const contact = location.state?.contact || "";

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    if (!contact) {
      setError("Contact information missing. Please login again.");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const email = contact.includes("@") ? contact : null;
      const phone = !contact.includes("@") ? contact : null;

      const response = await authService.verifyOTP(email, phone, otpString);
      
      if (response.token) {
        alert(response.message || "OTP verified successfully!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    if (!contact) {
      setError("Contact information missing. Please login again.");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const email = contact.includes("@") ? contact : null;
      const phone = !contact.includes("@") ? contact : null;

      await authService.requestOTP(email, phone);
      setTimer(60);
      alert("OTP resent successfully!");
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-wrapper">
      <div className="otp-card">
        <div className="otp-header">
          <h2>Verify OTP</h2>
          <p>
            Enter the 6-digit code sent to your{" "}
            {location.state?.method || "phone"}
          </p>
        </div>

        <form className="otp-form" onSubmit={handleVerify}>
          <div className="otp-inputs">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && <div className="error-message" style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</div>}

          <button type="submit" className="otp-btn" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="otp-footer">
          {timer > 0 ? (
            <span>Resend OTP in {timer}s</span>
          ) : (
            <button onClick={handleResend} className="resend-btn" disabled={isLoading}>
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
