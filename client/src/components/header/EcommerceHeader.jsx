import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/image.png";
import "./EcommerceHeader.css";
import { cartService } from "../../services/cartService";
import { authService } from "../../services/authService";
import { wishlistService } from "../../services/wishlistService";
import { categoryService } from "../../services/categoryService";

const EcommerceHeader = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "home", label: "Home", path: "/" },
    { key: "products", label: "Collections", path: "/collection" },
    { key: "about", label: "About", path: "/about" },
    { key: "contact", label: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('customerToken');
      if (token) {
        setUser(true);
        // Fetch cart and wishlist counts
        fetchCounts();
      } else {
        setUser(null);
        setCartCount(0);
        setWishlistCount(0);
      }
    };

    const fetchCounts = async () => {
      try {
        setLoadingCounts(true);
        // Fetch cart count
        try {
          const cartResponse = await cartService.getCart();
          if (cartResponse.items) {
            const totalItems = cartResponse.items.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(totalItems);
          }
        } catch (error) {
          console.error("Error fetching cart count:", error);
          setCartCount(0);
        }

        // Fetch wishlist count
        try {
          const wishlistResponse = await wishlistService.getWishlist();
          if (wishlistResponse.items) {
            setWishlistCount(wishlistResponse.items.length);
          }
        } catch (error) {
          console.error("Error fetching wishlist count:", error);
          setWishlistCount(0);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoadingCounts(false);
      }
    };

    checkAuth();
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (response.categories) {
          setCategories(response.categories.filter(cat => cat.is_active !== false));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    
    // Refresh counts when route changes (e.g., after adding to cart/wishlist)
    const interval = setInterval(() => {
      if (localStorage.getItem('customerToken')) {
        fetchCounts();
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <>
      <header className={`ecom-header ${scrolled ? "scrolled" : ""}`}>
        <div className="ecom-header-inner">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <img src={logo} alt="logo" />
          </Link>

          {/* Navigation */}
          <nav className="nav-links">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Categories Dropdown + Actions */}
          <div className="header-actions">
            <div 
              className="categories-dropdown"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
              style={{ position: 'relative' }}
            >
              <button className="categories-btn">
                Categories <i className="fa fa-chevron-down"></i>
              </button>
              {showCategories && categories.length > 0 && (
                <div className="categories-menu">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/collection?category=${cat.category_name}`}
                      onClick={() => setShowCategories(false)}
                      className="category-item"
                    >
                      {cat.category_name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="icon-group">
              <div className="icon-wrapper">
                <i
                  className="fa fa-heart"
                  onClick={() => navigate("/wishlist")}
                ></i>
                {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
              </div>
              <div className="icon-wrapper">
                <i
                  className="fa fa-shopping-cart"
                  onClick={() => navigate("/cart")}
                ></i>
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </div>
              <i
                className="fa fa-user"
                onClick={() =>
                  user ? navigate("/profile") : navigate("/login")
                }
              ></i>
              {user && (
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              )}
              <i
                className="fa fa-bars mobile-menu"
                onClick={() => setDrawerVisible(true)}
              ></i>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerVisible && (
        <div className="mobile-drawer">
          <div className="drawer-header">
            <h3>Cartier</h3>
            <button onClick={() => setDrawerVisible(false)}>✕</button>
          </div>
          <div className="drawer-links">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setDrawerVisible(false)}
                className={location.pathname === item.path ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="drawer-footer">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setDrawerVisible(false)}>
                  My Profile
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setDrawerVisible(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setDrawerVisible(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EcommerceHeader;
