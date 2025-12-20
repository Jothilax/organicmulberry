import Users from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1️⃣ Check if user exists
    const user = await Users.findOne({ where: { username } });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 2️⃣ Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "your_secret_key", // put this in .env
      { expiresIn: "1d" } // valid for 1 day
    );

    // 4️⃣ Send token in response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: err.message,
    });
  }
};

// ✅ Logout
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Error logging out" });
    res.json({ message: "Logged out successfully" });
  });
};

// ✅ Change Password
export const changePassword = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  try {
    const user = await Users.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(401).json({ message: "Old password is incorrect" });

    user.password = newPassword; // hashed in beforeUpdate hook
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password", error: err.message });
  }
};

// ✅ Forgot Password
export const forgotPassword = async (req, res) => {
  const { username } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await Users.findOne({ where: { username } });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ 
        message: "If the username exists, a password reset email will be sent" 
      });
    }

    // Generate new random password
    const crypto = await import("crypto");
    const newPassword = crypto.randomBytes(8).toString("hex");
    
    // Update user password (will be hashed by beforeUpdate hook)
    user.password = newPassword;
    await user.save();

    // TODO: Send email with new password
    // For now, just return success (in production, send email)
    console.log(`New password for ${username}: ${newPassword}`);

    return res.status(200).json({
      message: "Password reset successful. Please check your email for the new password.",
      // In production, remove this line and send email instead
      tempPassword: newPassword, // Remove in production
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return res.status(500).json({ 
      message: "Error resetting password", 
      error: err.message 
    });
  }
};


