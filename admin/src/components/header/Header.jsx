// // import React, { useState } from "react";
// // import styles from "./header.module.css";
// // import logo from "../../assets/image.png";
// // import { FaBars, FaShoppingCart, FaBell } from "react-icons/fa";
// // import Sidebar from "../sidebar/Sidebar";

// // export default function Header() {
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   const toggleSidebar = () => setSidebarOpen((prev) => !prev);

// //   return (
// //     <>
// //       <header className={styles.header}>
// //         <div className={styles.menu}>
// //           <FaBars className={styles.icon} onClick={toggleSidebar} />
// //         </div>

// //         <div className={styles.logoContainer}>
// //           <img src={logo} alt="Logo" className={styles.logo} />
// //         </div>

// //         <div className={styles.actions}>
// //           <FaShoppingCart className={styles.icon} />
// //           <FaBell className={styles.icon} />
// //           <button className={styles.loginBtn}>Login</button>
// //         </div>
// //       </header>

// //       {/* Sidebar shows when open */}
// //       {sidebarOpen && <Sidebar closeSidebar={toggleSidebar} />}
// //     </>
// //   );
// // }


// import React, { useState } from "react";
// import styles from "./header.module.css";
// import logo from "../../assets/image.png";
// import { FaBars, FaUserCircle } from "react-icons/fa";
// import Sidebar from "../sidebar/Sidebar";

// export default function Header() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleSidebar = () => setSidebarOpen((prev) => !prev);
//   const toggleMenu = () => setMenuOpen((prev) => !prev);

//   return (
//     <>
//       <header className={styles.header}>
//         <div className={styles.menu}>
//           <FaBars className={styles.icon} onClick={toggleSidebar} />
//         </div>

//         <div className={styles.logoContainer}>
//           <img src={logo} alt="Logo" className={styles.logo} />
//           {/* <h2 className={styles.brandTitle}>THE ORGANIC MULBERRY</h2> */}
//         </div>

//         <div className={styles.profileContainer}>
//           <FaUserCircle className={styles.profileIcon} onClick={toggleMenu} />
//           {menuOpen && (
//             <div className={styles.dropdownMenu}>
//               <button className={styles.dropdownItem}>Profile</button>
//               <button className={styles.dropdownItem}>Change Password</button>
//               <button className={styles.dropdownItem}>Logout</button>
//             </div>
//           )}
//         </div>
//       </header>

//       {sidebarOpen && <Sidebar closeSidebar={toggleSidebar} />}
//     </>
//   );
// }


import React, { useState } from "react";
import styles from "./header.module.css";
import logo from "../../assets/image.png";
import { FaBars, FaUserCircle } from "react-icons/fa";
import Sidebar from "../sidebar/Sidebar";
import { logout, changePassword } from "../../services/authService";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [username] = useState(localStorage.getItem("username") || "Jothi");

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      alert("Logged out successfully!");
      window.location.href = "/login";
    } catch (error) {
      alert("Logout failed!");
      console.error(error);
    }
  };

  // ✅ Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await changePassword(username, oldPassword, newPassword);
      alert("Password changed successfully!");
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      alert("Password change failed!");
      console.error(error);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.menu}>
          <FaBars className={styles.icon} onClick={toggleSidebar} />
        </div>

        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>

        <div className={styles.profileContainer}>
          <FaUserCircle className={styles.profileIcon} onClick={toggleMenu} />
          {menuOpen && (
            <div className={styles.dropdownMenu}>
              {/* <button className={styles.dropdownItem}>Profile</button> */}
              <button
                className={styles.dropdownItem}
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
              <button className={styles.dropdownItem} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {sidebarOpen && <Sidebar closeSidebar={toggleSidebar} />}

      {/* 🔐 Password Change Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div className={styles.modalActions}>
                <button type="submit">Update</button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
