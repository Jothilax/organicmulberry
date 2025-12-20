// // src/components/EcommerceFooter.jsx
// import { Link } from "react-router-dom";
// import "./EcommerceFooter.css";

// const EcommerceFooter = () => {
//   return (
//     <footer className="footer">
//       <div className="footer-container">
//         {/* Newsletter */}
//         <div className="newsletter">
//           <div className="newsletter-content">
//             <div>
//               <h3>Join our Insider List</h3>
//               <p>Get new launches and offers. 10% off your first order.</p>
//             </div>
//             <form className="newsletter-form">
//               <input type="email" placeholder="Enter your email" />
//               <button>Subscribe</button>
//             </form>
//           </div>
//         </div>

//         {/* Main sections */}
//         <div className="footer-grid">
//           {/* Company Info */}
//           <div className="footer-section">
//             <h3 className="footer-title">The Organic Mulberry</h3>
//             <p className="footer-text">
//               Crafting comfort and elegance through high-quality textiles for homes and hospitality.
//             </p>
//             <div className="footer-socials">
//               <a href="#">Facebook</a>
//               <a href="#">Instagram</a>
//               <a href="#">Twitter</a>
//               <a href="#">YouTube</a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="footer-section">
//             <h3 className="footer-title">Quick Links</h3>
//             <ul>
//               <li>
//                 <Link to="/">Home</Link>
//               </li>
//               <li>
//                 <Link to="/collection">Shop</Link>
//               </li>
//               <li>
//                 <Link to="/about">About Us</Link>
//               </li>
//               <li>
//                 <Link to="/contact">Contact</Link>
//               </li>
//             </ul>
//           </div>

//           {/* Categories */}
//           <div className="footer-section">
//             <h3 className="footer-title">Categories</h3>
//             <ul>
//               <li>
//                 <a href="#">Gold Jewellery</a>
//               </li>
//               <li>
//                 <a href="#">Diamond Jewellery</a>
//               </li>
//               <li>
//                 <a href="#">Silver Jewellery</a>
//               </li>
//               <li>
//                 <a href="#">Platinum Jewellery</a>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div className="footer-section">
//             <h3 className="footer-title">Our Office</h3>
//             <div className="footer-contact">
//               <p>5/405 Kamanayakanpalayam Road</p>
//               <p>Karadivavi, Palladam</p>
//               <p>Tirupur – 641658, Tamil Nadu, India</p>
//               <p style={{ marginTop: '1rem' }}>📞 <strong>Call Us</strong></p>
//               <p>+91 95663 80568</p>
//               <p>Mon – Sat: 9:00 AM – 6:00 PM</p>
//               <p style={{ marginTop: '1rem' }}> <strong>Email Us</strong></p>
//               <p>theorganicmulberrycbe@gmail.com</p>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="footer-bottom">
//           <p>© 2025 The Organic Mulberry. All rights reserved.</p>
//           <div className="footer-links">
//             <Link to="/about">About</Link>
//             <Link to="/contact">Contact</Link>
//             <a href="#">Privacy</a>
//             <a href="#">Terms</a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default EcommerceFooter;


// src/components/EcommerceFooter.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./EcommerceFooter.css";
import { categoryService } from "../../services/categoryService.js"; // adjust path if needed

const EcommerceFooter = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();

        if (res?.categories) {
          const activeCategories = res.categories
            .filter((cat) => cat.is_active !== false)
            .map((cat) => cat.category_name);

          setCategories(activeCategories);
        }
      } catch (err) {
        console.log("Footer categories error:", err);
      }
    };
    loadCategories();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Newsletter */}
        <div className="newsletter">
          <div className="newsletter-content">
            <div>
              <h3>Join our Insider List</h3>
              <p>Get new launches and offers. 10% off your first order.</p>
            </div>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </form>
          </div>
        </div>

        {/* Main sections */}
        <div className="footer-grid">

          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">The Organic Mulberry</h3>
            <p className="footer-text">
              Crafting comfort and elegance through high-quality textiles for homes and hospitality.
            </p>
            <div className="footer-socials">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
              {/* <a href="UCioE6iNm22Sa5h4OMpVuQaQ">YouTube</a> */}
              <a href="https://www.youtube.com/channel/UCioE6iNm22Sa5h4OMpVuQaQ" target="_blank" rel="noopener noreferrer">
  YouTube
</a>

            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/collection">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>   {/* corrected route */}
              <li><Link to="/contact">Contact</Link></li>  {/* corrected route */}
            </ul>
          </div>

          {/* Dynamic Categories */}
          <div className="footer-section">
            <h3 className="footer-title">Categories</h3>
            <ul>
              {categories.length > 0 ? (
                categories.map((cat, i) => (
                  <li key={i}>
                    <Link to={`/collection?category=${cat}`}>{cat}</Link>
                  </li>
                ))
              ) : (
                <li>No categories found</li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Our Office</h3>
            <div className="footer-contact">

              {/* Location with icon */}
              <p>📍 <strong>Location</strong></p>
              <p>5/405 Kamanayakanpalayam Road</p>
              <p>Karadivavi, Palladam</p>
              <p>Tirupur – 641658, Tamil Nadu, India</p>

              {/* Phone */}
              <p style={{ marginTop: "1rem" }}>📞 <strong>Call Us</strong></p>
              <p>+91 95663 80568</p>
              <p>Mon – Sat: 9:00 AM – 6:00 PM</p>

              {/* Email with icon */}
              <p style={{ marginTop: "1rem" }}>✉️ <strong>Email Us</strong></p>
              <p>theorganicmulberrycbe@gmail.com</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© 2025 The Organic Mulberry. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default EcommerceFooter;
