// import React from "react";
// import { Link } from "react-router-dom";
// import "./AboutPage.css";

// const AboutPage = () => {
//   return (
//     <div className="about-page">
//       {/* Background Effects */}
//       <div className="bg-circle bg-yellow-light"></div>
//       <div className="bg-circle bg-yellow-lighter"></div>

//       <div className="about-container">
//         {/* Header */}
//         <div className="about-header">
//           <h1>About Our Jewellery Store</h1>
//           <p>
//             Discover the story behind our exquisite collection of handcrafted
//             jewellery.
//           </p>
//         </div>

//         {/* Heritage Section */}
//         <div className="about-heritage">
//           <div className="heritage-image">
//             <img
//               src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600"
//               alt="Jewellery craftsmanship"
//             />
//           </div>
//           <div className="heritage-content">
//             <h2>Our Heritage</h2>
//             <p>
//               With over 100 years of experience in the jewellery industry, we
//               have been crafting exquisite pieces that tell stories of
//               tradition, love, and celebration. Our master craftsmen combine
//               traditional techniques with modern designs to create timeless
//               pieces.
//             </p>
//             <p>
//               Every piece of jewellery that leaves our workshop is a testament
//               to our commitment to quality, authenticity, and customer
//               satisfaction. We source only the finest materials and work with
//               skilled artisans who have dedicated their lives to this craft.
//             </p>
//             <Link to="/collection" className="btn-yellow">
//               Explore Our Collection
//             </Link>
//           </div>
//         </div>

//         {/* Values Section */}
//         <div className="about-values">
//           <h2>Our Values</h2>
//           <div className="values-grid">
//             <div className="value-card">
//               <div className="value-icon">💎</div>
//               <h3>Quality</h3>
//               <p>
//                 Every piece is crafted with the highest quality materials and
//                 undergoes rigorous quality checks.
//               </p>
//             </div>
//             <div className="value-card">
//               <div className="value-icon">🔒</div>
//               <h3>Trust</h3>
//               <p>
//                 We build lasting relationships with our customers through
//                 transparency and honest business practices.
//               </p>
//             </div>
//             <div className="value-card">
//               <div className="value-icon">🎨</div>
//               <h3>Innovation</h3>
//               <p>
//                 We continuously innovate while respecting traditional
//                 craftsmanship techniques.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Visit Section */}
//         <div className="about-visit">
//           <h2>Visit Our Store</h2>
//           <div className="visit-grid">
//             <div className="visit-info">
//               <h3>Store Information</h3>
//               <p>
//                 <strong>Address:</strong> 123 Jewellery Lane, Gold District,
//                 Mumbai 400001
//               </p>
//               <p>
//                 <strong>Phone:</strong> +91 22 1234 5678
//               </p>
//               <p>
//                 <strong>Email:</strong> info@jewellerystore.com
//               </p>
//               <p>
//                 <strong>Hours:</strong> Mon–Sat: 10:00 AM – 8:00 PM, Sun:
//                 11:00 AM – 6:00 PM
//               </p>
//             </div>
//             <div className="visit-why">
//               <h3>Why Visit Us?</h3>
//               <ul>
//                 <li>Personal consultation with our jewellery experts</li>
//                 <li>Custom design services</li>
//                 <li>Jewellery repair and maintenance</li>
//                 <li>Certification and appraisal services</li>
//                 <li>Exclusive in-store collections</li>
//               </ul>
//             </div>
//           </div>

//           <div className="visit-button">
//             <Link to="/collection" className="btn-yellow">
//               Shop Collection
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutPage;


import React from "react";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Background Effects */}
      <div className="bg-circle bg-yellow-light"></div>
      <div className="bg-circle bg-yellow-lighter"></div>

      <div className="about-container">
        {/* Header */}
        <div className="about-header">
          <h1>About Linen and More Ltd.</h1>
          <p>
            Crafting comfort, elegance, and innovation in textiles for homes and
            hospitality worldwide.
          </p>
        </div>

        {/* Heritage Section */}
        <div className="about-heritage">
          <div className="heritage-image">
            <img
              src="https://images.unsplash.com/photo-1595433707802-260c4c0b09aa?w=800"
              alt="Luxury textiles and linen"
            />
          </div>
          <div className="heritage-content">
            <h2>Our Heritage</h2>
            <p>
              Linen and More Ltd. is part of the <strong>B&E Group</strong>, a
              trusted name in textiles with more than{" "}
              <strong>45 years of industry experience</strong>. With operations
              in <strong>Israel</strong> and <strong>India</strong> and an
              upcoming facility in <strong>Egypt</strong>, we employ over{" "}
              <strong>150 dedicated professionals</strong> committed to quality
              and innovation.
            </p>
            <p>
              For decades, families around the world have chosen our textiles to
              bring comfort and elegance into their homes. Building on this
              strong foundation, we have expanded into the{" "}
              <strong>hospitality and HoReCa sector</strong>, offering tailored
              textile solutions for hotels, resorts, restaurants, spas, and
              wellness spaces.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="about-values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🧵</div>
              <h3>Quality & Precision</h3>
              <p>
                Every product is crafted with care, combining durability,
                comfort, and style to meet international standards.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Global Excellence</h3>
              <p>
                With projects across Europe and the USA, we bring proven
                expertise in delivering large-scale and customized textile
                solutions.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Innovation</h3>
              <p>
                We combine tradition with technology to create flexible,
                cost-effective solutions that elevate guest experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Collections Section */}
        <div className="about-collections">
          <h2>Our Collections</h2>
          <p>
            Our diverse product range includes <strong>bed linen, duvets,
            pillows, tablecloths, bathrobes, towels, slippers,</strong> and{" "}
            <strong>decorative textiles</strong>—each crafted to reflect the
            unique brand identity of our clients in the hospitality sector.
          </p>
          <p>
            From design to delivery, we focus on providing seamless textile
            solutions that save time, reduce costs, and enhance comfort for
            guests around the world.
          </p>
        </div>

        {/* Mission Section */}
        <div className="about-mission">
          <h2>Our Mission</h2>
          <p>
            At <strong>Linen and More</strong>, we blend tradition with
            innovation to deliver textile solutions that go beyond products—
            contributing to the growth and success of our partners worldwide.
          </p>
        </div>

        {/* Contact Section */}
        <div className="about-visit">
          <h2>Get in Touch</h2>
          <div className="visit-grid">
            <div className="visit-info">
              <h3>Head Office</h3>
              <p>
                <strong>Address:</strong> Linen and More Ltd., B&E Group, Israel
                & India
              </p>
              <p>
                <strong>Email:</strong> info@linenandmore.com
              </p>
              <p>
                <strong>Phone:</strong> +91 22 1234 5678
              </p>
            </div>
            <div className="visit-why">
              <h3>Why Partner With Us?</h3>
              <ul>
                <li>Customized textile solutions for every space</li>
                <li>Trusted by leading hotels and resorts globally</li>
                <li>Proven expertise in large-scale projects</li>
                <li>Dedicated team ensuring top-notch quality</li>
              </ul>
            </div>
          </div>
          <div className="visit-button">
            <a href="/contact" className="btn-yellow">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
