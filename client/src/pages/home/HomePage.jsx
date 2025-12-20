import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroSlides = [
    {
      title: "Linen and More",
      subtitle: "The essence of natural fiber",
      description:
        "Crafting comfort and elegance through high-quality textiles for homes and hospitality.",
      image: "https://via.placeholder.com/1200x600?text=Linen+and+More",
      btnText: "LEARN MORE",
    },
    {
      title: "HoReCa Approach",
      subtitle: "Textile Solutions for Hospitality",
      description:
        "Delivering premium linen and textile products tailored for resorts, hotels, hospitals, and more.",
      image: "https://via.placeholder.com/1200x600?text=HoReCa+Solutions",
      btnText: "OUR APPROACH",
    },
    {
      title: "Premium Comfort",
      subtitle: "Luxury Textile Products",
      description:
        "Experience the finest in bed linen, duvets, towels, and more – crafted for comfort and durability.",
      image: "https://via.placeholder.com/1200x600?text=Premium+Comfort",
      btnpText: "EXPLORE PRODUCTS",
    },
  ];

  const stats = [
    { icon: "🏨", value: "200+", label: "Hotels & Resorts Served" },
    { icon: "🧵", value: "45+", label: "Years of Textile Expertise" },
    { icon: "🌿", value: "100%", label: "Natural Fiber Quality" },
    { icon: "🤝", value: "Global", label: "Partnership Network" },
  ];

  // Fetch categories and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await categoryService.getAllCategories();
        if (categoriesResponse.categories) {
          setCategories(categoriesResponse.categories.filter(cat => cat.is_active !== false));
        }

        // Fetch products
        const productsResponse = await productService.getAllProducts();
        if (productsResponse.data) {
          // Get first 4 products or products with primary images
          const products = productsResponse.data
            .filter(product => product.is_active !== false)
            .slice(0, 4)
            .map(product => {
              const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
              return {
                id: product.id,
                name: product.name,
                price: `₹${product.price?.toLocaleString() || '0'}`,
                image: primaryImage?.imageUrl || (primaryImage?.images ? `http://localhost:3000/uploads/products/${primaryImage.images}` : null),
                category: product.category?.category_name || "General",
              };
            });
          setFeaturedProducts(products);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Keep default products on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay">
              <div className="hero-content">
                <h1>{slide.title}</h1>
                <h2>{slide.subtitle}</h2>
                <p>{slide.description}</p>
                {/* <div className="hero-buttons">
                 {slide.btnText ? (
  <Link to="/about" className="btn btn-dark">
    {slide.btnText}
  </Link>
) : (
  <Link to="/collection" className="btn btn-dark">
    {slide.btnpText}
  </Link>
)}
 
                  {/* if(slide.btnText){
                    <Link to="/about" className="btn btn-dark">
                    {slide.btnText}
                  </Link>

                  }else{
                    <Link to="/collection" className="btn btn-dark">
                    {slide.btnpText}
                  </Link>

                  } */}
                  
                  {/* <button className="btn btn-light"> *
                     <Link to="/contact" className="btn btn-dark">
                    CONTACT US
                  </Link>
                  
                  {/* </button> 
                </div> */}

                <div className="hero-buttons">
  {slide.btnText ? (
    <Link to="/about" className="btn btn-dark">
      {slide.btnText}
    </Link>
  ) : (
    <Link to="/collection" className="btn btn-dark">
      {slide.btnpText}
    </Link>
  )}

  <Link to="/contact" className="btn btn-dark">
    CONTACT US
  </Link>
</div>

                <div className="hero-dots">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={i === currentSlide ? "dot active" : "dot"}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* INTRO SECTION */}
      <section className="intro">
        <h2 className="section-title">The Essence of Natural Fiber</h2>
        <p className="section-subtitle">
          Over the years, hundreds of families have chosen us for quality home textiles. Our
          expertise now extends to the HoReCa sector, delivering tailored solutions for hospitality.
        </p>
        <div className="center">
          <Link to="/about" className="btn btn-dark">
            Learn More
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <h2 className="section-title">Our Legacy in Textiles</h2>
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">{stat.icon}</div>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured">
        <h2 className="section-title">Our Products</h2>
        <p className="section-subtitle">
          Bringing style, comfort, and functionality to your home and hospitality space.
        </p>
        {loading ? (
          <div className="product-grid">
            {[1, 2, 3, 4].map((i) => (
              <div className="product-item" key={i}>
                <div className="product-card" style={{ opacity: 0.5 }}>
                  <div style={{ width: '100%', height: '200px', background: '#f0f0f0' }}></div>
                  <h3>Loading...</h3>
                  <p>...</p>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <>
            <div className="product-grid">
              {featuredProducts.map((p) => (
                <Link to={`/collectiondetails/${p.id}`} key={p.id} className="product-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-card">
                    <img 
                      src={p.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"} 
                      alt={p.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <h3>{p.name}</h3>
                    <p>{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="center">
              <Link to="/collection" className="btn btn-dark large">
                🛍️ Explore All Products
              </Link>
            </div>
          </>
        ) : (
          <div className="center">
            <p>No products available at the moment.</p>
            <Link to="/collection" className="btn btn-dark large">
              🛍️ Explore All Products
            </Link>
          </div>
        )}
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-us">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="why-grid">
          {[
            {
              title: "Marketing",
              desc: "We market luxury bedding products globally, focusing on the US and EU markets.",
            },
            {
              title: "Partnership",
              desc: "Collaborating with leading international brands to deliver excellence.",
            },
            {
              title: "Growth",
              desc: "45 years of textile expertise with strong B2B foundation and customer focus.",
            },
            {
              title: "Sales",
              desc: "Trusted by renowned 5-star hotels, resorts, and global clients.",
            },
            {
              title: "Design",
              desc: "In-house design team developing custom textile collections for clients.",
            },
            {
              title: "Know-How",
              desc: "Decades of experience, advanced sewing techniques, and trend-driven innovation.",
            },
          ].map((item, i) => (
            <div className="why-card" key={i}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="cta-icon"></div>
        <h2>Crafting Comfort with Care</h2>
        <p>
          From premium linens to customized hospitality solutions — your comfort is our craft.
        </p>
        <div className="cta-buttons">
          <Link to="/collection" className="btn btn-dark large">
            Explore Products
          </Link>
          <Link to="/contact" className="btn btn-light large">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
