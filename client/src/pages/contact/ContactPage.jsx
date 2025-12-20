// import React from "react";
// import "./ContactPage.css";

// const ContactPage = () => {
//   return (
//     <div className="contact-page">
//       <div className="yellow-circle circle1"></div>
//       <div className="yellow-circle circle2"></div>

//       <div className="contact-container">
//         <div className="contact-header">
//           <h1>Contact Us</h1>
//           <p>
//             Get in touch with us for any queries, custom designs, or jewellery
//             consultations
//           </p>
//         </div>

//         <div className="contact-grid">
//           {/* ---------- LEFT SIDE INFO ---------- */}
//           <div className="contact-info">
//             <h2>Get In Touch</h2>

//             <div className="info-item">
//               <div className="icon">📍</div>
//               <div>
//                 <h3>Visit Our Store</h3>
//                 <p>
//                   123 Jewellery Lane <br />
//                   Gold District, Mumbai 400001 <br />
//                   Maharashtra, India
//                 </p>
//               </div>
//             </div>

//             <div className="info-item">
//               <div className="icon">📞</div>
//               <div>
//                 <h3>Call Us</h3>
//                 <p>
//                   +91 22 1234 5678 <br />
//                   +91 22 1234 5679 (WhatsApp)
//                 </p>
//               </div>
//             </div>

//             <div className="info-item">
//               <div className="icon">✉️</div>
//               <div>
//                 <h3>Email Us</h3>
//                 <p>
//                   info@jewellerystore.com <br />
//                   support@jewellerystore.com
//                 </p>
//               </div>
//             </div>

//             <div className="info-item">
//               <div className="icon">🕒</div>
//               <div>
//                 <h3>Store Hours</h3>
//                 <p>
//                   Monday - Saturday: 10:00 AM - 8:00 PM <br />
//                   Sunday: 11:00 AM - 6:00 PM <br />
//                   <span className="small-text">
//                     Closed on Public Holidays
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ---------- RIGHT SIDE FORM ---------- */}
//           <div className="contact-form">
//             <h2>Send Us a Message</h2>
//             <form>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>First Name</label>
//                   <input type="text" placeholder="Enter your first name" />
//                 </div>
//                 <div className="form-group">
//                   <label>Last Name</label>
//                   <input type="text" placeholder="Enter your last name" />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>Email</label>
//                 <input type="email" placeholder="Enter your email address" />
//               </div>

//               <div className="form-group">
//                 <label>Phone</label>
//                 <input type="tel" placeholder="Enter your phone number" />
//               </div>

//               <div className="form-group">
//                 <label>Subject</label>
//                 <select>
//                   <option>General Inquiry</option>
//                   <option>Custom Design</option>
//                   <option>Jewellery Repair</option>
//                   <option>Product Information</option>
//                   <option>Complaint</option>
//                   <option>Other</option>
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>Message</label>
//                 <textarea
//                   rows="5"
//                   placeholder="Tell us how we can help you..."
//                 ></textarea>
//               </div>

//               <button type="submit" className="submit-btn">
//                 Send Message
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* ---------- BOTTOM MAP SECTION ---------- */}
//         <div className="find-us">
//           <h2>Find Us</h2>
//           <div className="map-placeholder">
//             <span>Interactive Map Coming Soon</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactPage;


import React, { useState } from "react";
import "./ContactPage.css";
import { contactService } from "../../services/contactService";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await contactService.submitContact(formData);
      setSubmitStatus({ type: 'success', message: response.message || 'Message sent successfully!' });
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="yellow-circle circle1"></div>
      <div className="yellow-circle circle2"></div>

      <div className="contact-container">
        {/* ---------- HEADER ---------- */}
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>
            We’d love to hear from you — reach out for business inquiries,
            custom textile solutions, or partnership opportunities.
          </p>
        </div>

        {/* ---------- CONTACT GRID ---------- */}
        <div className="contact-grid">
          {/* ---------- LEFT SIDE INFO ---------- */}
          <div className="contact-info">
            <h2>Get In Touch</h2>

            <div className="info-item">
              <div className="icon">📍</div>
              <div>
                <h3>Our Office</h3>
                <p>
                  5/405 Kamanayakanpalayam Road <br />
                  Karadivavi, Palladam <br />
                  Tirupur – 641658, Tamil Nadu, India
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">📞</div>
              <div>
                <h3>Call Us</h3>
                <p>
                  +91 95663 80568 <br />
                  Mon – Sat: 9:00 AM – 6:00 PM
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">✉️</div>
              <div>
                <h3>Email Us</h3>
                <p>
                  theorganicmulberrycbe@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* ---------- RIGHT SIDE FORM ---------- */}
          <div className="contact-form">
            <h2>Send Us a Message</h2>
            {submitStatus && (
              <div className={`submit-status ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option>General Inquiry</option>
                  <option>Product Information</option>
                  <option>Bulk Order</option>
                  <option>Partnership</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us how we can assist you..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* ---------- MAP SECTION ---------- */}
        <div className="find-us">
          <h2>Find Us</h2>
          <div className="map-placeholder">
            <iframe
              title="The Organic Mulberry Location"
              src="https://www.google.com/maps?q=5/405+Kamanayakanpalayam+Road+Karadivavi+Palladam+Tirupur+641658&output=embed"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
