// // import React from "react";
// // import styles from "./sidebar.module.css";
// // import { Link } from "react-router-dom";

// // export default function Sidebar({ closeSidebar }) {
// //   return (
// //     <div className={styles.sidebarOverlay} onClick={closeSidebar}>
// //       <aside
// //         className={styles.sidebar}
// //         onClick={(e) => e.stopPropagation()} // keep clicks inside from closing
// //         role="navigation"
// //         aria-label="Main navigation"
// //       >
// //         <button
// //           className={styles.closeBtn}
// //           onClick={closeSidebar}
// //           aria-label="Close sidebar"
// //         >
// //           ✖
// //         </button>

// //         <ul className={styles.menuList}>
// //           <li>
// //             <Link to="/category" onClick={closeSidebar}>
// //               Category
// //             </Link>
// //           </li>
// //           <li>
// //             <Link to="/products" onClick={closeSidebar}>
// //               Products
// //             </Link>
// //           </li>
// //           <li>
// //             <Link to="/customers" onClick={closeSidebar}>
// //               Customers
// //             </Link>
// //           </li>
// //           <li>
// //             <Link to="/users" onClick={closeSidebar}>
// //               Users
// //             </Link>
// //           </li>
// //           <li>
// //             <Link to="/masters" onClick={closeSidebar}>
// //               Masters
// //             </Link>
// //           </li>
// //         </ul>
// //       </aside>
// //     </div>
// //   );
// // }


// import React, { useState } from "react";
// import styles from "./sidebar.module.css";
// import { Link } from "react-router-dom";

// export default function Sidebar({ closeSidebar }) {
//   const [openMenu, setOpenMenu] = useState(null);

//   const toggleMenu = (menu) => {
//     setOpenMenu(openMenu === menu ? null : menu);
//   };

//   return (
//     <div className={styles.sidebarOverlay} onClick={closeSidebar}>
//       <aside
//         className={styles.sidebar}
//         onClick={(e) => e.stopPropagation()}
//         role="navigation"
//         aria-label="Main navigation"
//       >
//         <button
//           className={styles.closeBtn}
//           onClick={closeSidebar}
//           aria-label="Close sidebar"
//         >
//           ✖
//         </button>

//         <ul className={styles.menuList}>
//           <li>
//             <Link to="/category" onClick={closeSidebar}>
//               Category
//             </Link>
//           </li>
//           <li>
//             <Link to="/products" onClick={closeSidebar}>
//               Products
//             </Link>
//           </li>
          
//           {/* Users Menu */}
//           <li>
//             <button
//               className={styles.menuButton}
//               onClick={() => toggleMenu("users")}
//             >
//               Users {openMenu === "users" ? "▲" : "▼"}
//             </button>
//             {openMenu === "users" && (
//               <ul className={styles.subMenuList}>
//                 <li>
//                   <Link to="/users" onClick={closeSidebar}>
//                     Users
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/role" onClick={closeSidebar}>
//                     Role
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Masters Menu */}
//           <li>
//             <button
//               className={styles.menuButton}
//               onClick={() => toggleMenu("masters")}
//             >
//               Masters {openMenu === "masters" ? "▲" : "▼"}
//             </button>
//             {openMenu === "masters" && (
//               <ul className={styles.subMenuList}>
//                 <li>
//                   <Link to="/size" onClick={closeSidebar}>
//                     Size
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/color" onClick={closeSidebar}>
//                     Color
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/company" onClick={closeSidebar}>
//                     Company
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           <li>
//             <Link to="/customers" onClick={closeSidebar}>
//               Customers
//             </Link>
//           </li>
//         </ul>
//       </aside>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import styles from "./sidebar.module.css";
// import { Link } from "react-router-dom";

// export default function Sidebar({ closeSidebar }) {
//   const [openMenu, setOpenMenu] = useState(null);

//   const toggleMenu = (menu) => {
//     setOpenMenu(openMenu === menu ? null : menu);
//   };

//   return (
//     <div className={styles.sidebarOverlay} onClick={closeSidebar}>
//       <aside
//         className={styles.sidebar}
//         onClick={(e) => e.stopPropagation()}
//         role="navigation"
//         aria-label="Main navigation"
//       >
//         <button
//           className={styles.closeBtn}
//           onClick={closeSidebar}
//           aria-label="Close sidebar"
//         >
//           ✖
//         </button>

//         <ul className={styles.menuList}>
//           <li>
//             <Link to="/category" onClick={closeSidebar}>
//               Category
//             </Link>
//           </li>
//           <li>
//             <Link to="/products" onClick={closeSidebar}>
//               Products
//             </Link>
//           </li>

//           {/* Users with submenus */}
//           <li onClick={() => toggleMenu("users")} className={styles.menuItem}>
//             <span>Users {openMenu === "users" ? "▲" : "▼"}</span>
//             {openMenu === "users" && (
//               <ul className={styles.subMenuList}>
//                 <li>
//                   <Link to="/users" onClick={closeSidebar}>
//                     Users
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/role" onClick={closeSidebar}>
//                     Role
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Masters with submenus */}
//           <li onClick={() => toggleMenu("masters")} className={styles.menuItem}>
//             <span>Masters {openMenu === "masters" ? "▲" : "▼"}</span>
//             {openMenu === "masters" && (
//               <ul className={styles.subMenuList}>
//                 <li>
//                   <Link to="/size" onClick={closeSidebar}>
//                     Size
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/color" onClick={closeSidebar}>
//                     Color
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/company" onClick={closeSidebar}>
//                     Company
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           <li>
//             <Link to="/customers" onClick={closeSidebar}>
//               Customers
//             </Link>
//           </li>
//         </ul>
//       </aside>
//     </div>
//   );
// }


import React, { useState } from "react";
import styles from "./sidebar.module.css";
import { Link } from "react-router-dom";
import { AppstoreOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";

export default function Sidebar({ closeSidebar }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className={styles.sidebarOverlay} onClick={closeSidebar}>
      <aside
        className={styles.sidebar}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={closeSidebar} aria-label="Close sidebar">
          ✖ Close
        </button>

        <ul className={styles.menuList}>
          {/* Category */}
          <li>
            <Link to="/category" className={styles.menuLink}>
              <AppstoreOutlined className={styles.icon} />
              <span>Category</span>
            </Link>
          </li>

          {/* Masters */}
          <li className={styles.menuItem} onClick={() => toggleMenu("masters")}>
            <div className={styles.menuLink}>
              <SettingOutlined className={styles.icon} />
              <span>Masters</span>
              <span className={styles.arrow}>{openMenu === "masters" ? "▲" : "▼"}</span>
            </div>

            {openMenu === "masters" && (
              <ul className={styles.subMenuList}>
                <li><Link to="/size">Size</Link></li>
                <li><Link to="/color">Color</Link></li>
                <li><Link to="/coupon">Coupon</Link></li>
              </ul>
            )}
          </li>

          {/* Products */}
          <li>
            <Link to="/products" className={styles.menuLink}>
              <AppstoreOutlined className={styles.icon} />
              <span>Products</span>
            </Link>
          </li>

          {/* Users */}
          <li className={styles.menuItem} onClick={() => toggleMenu("users")}>
            <div className={styles.menuLink}>
              <UserOutlined className={styles.icon} />
              <span>Users</span>
              <span className={styles.arrow}>{openMenu === "users" ? "▲" : "▼"}</span>
            </div>

            {openMenu === "users" && (
              <ul className={styles.subMenuList}>
                <li><Link to="/users">Users</Link></li>
                <li><Link to="/role">Role</Link></li>
              </ul>
            )}
          </li>

          {/* Customers */}
          <li>
            <Link to="/customers" className={styles.menuLink}>
              <UserOutlined className={styles.icon} />
              <span>Customers</span>
            </Link>
          </li>

          {/* Orders */}
          <li>
            <Link to="/orders" className={styles.menuLink}>
              <AppstoreOutlined className={styles.icon} />
              <span>Orders</span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}
