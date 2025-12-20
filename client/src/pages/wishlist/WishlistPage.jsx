import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./WishlistPage.css";
import { wishlistService } from "../../services/wishlistService";
import { cartService } from "../../services/cartService";

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [removingItem, setRemovingItem] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('customerToken');
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await wishlistService.getWishlist();
        if (response.items) {
          const formattedItems = response.items.map((item) => {
            const product = item.product;
            const primaryImage = product?.images?.find(img => img.is_primary) || product?.images?.[0];
            const imageUrl = primaryImage?.imageUrl || 
              (primaryImage?.images ? `http://localhost:3000/uploads/products/${primaryImage.images}` : null) ||
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23f0f0f0' width='300' height='200'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E";

            return {
              id: item.id,
              productId: item.product_id,
              name: product?.name || "Unknown Product",
              category: product?.category?.category_name || "General",
              image: imageUrl,
              price: product?.price || 0,
              originalPrice: product?.mrp || product?.price || 0,
              rating: product?.rating || 0,
              reviewCount: product?.reviewsCount || 0,
              addedDate: item.addedDate || item.createdAt,
            };
          });
          setWishlistItems(formattedItems);
          
          // Generate share URL
          const baseUrl = window.location.origin;
          const wishlistParam = formattedItems.map((item) => item.productId).join(",");
          setShareUrl(`${baseUrl}/wishlist?items=${wishlistParam}`);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  const handleRemove = async (wishlistItemId) => {
    try {
      setRemovingItem(wishlistItemId);
      await wishlistService.removeFromWishlist(wishlistItemId);
      setWishlistItems(wishlistItems.filter((item) => item.id !== wishlistItemId));
      alert("Removed from wishlist!");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert(error.response?.data?.message || "Failed to remove from wishlist");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await cartService.addToCart(product.productId, 1);
      alert(`${product.name} added to cart!`);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Jewellery Wishlist",
        text: "Check out my wishlist!",
        url: shareUrl,
      });
    } else {
      setShareModalVisible(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Wishlist link copied!");
  };

  const handleCloseModal = () => setShareModalVisible(false);

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <h1>💖 My Wishlist</h1>
            <p>Loading wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>💖 My Wishlist</h1>
          <p>
            {wishlistItems.length === 0
              ? "Your wishlist is empty. Start adding your favourite pieces!"
              : `${wishlistItems.length} ${
                  wishlistItems.length === 1 ? "item" : "items"
                } saved for later`}
          </p>

          {wishlistItems.length > 0 && (
            <button className="share-btn" onClick={handleShare}>
              🔗 Share Wishlist
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-state">
            <h2>Your wishlist is empty</h2>
            <p>Start browsing and save items you love for later!</p>
            <div className="empty-buttons">
              <Link to="/collection" className="primary" style={{ textDecoration: 'none', display: 'inline-block', padding: '10px 20px', margin: '5px' }}>
                Browse Products
              </Link>
              <Link to="/" className="secondary" style={{ textDecoration: 'none', display: 'inline-block', padding: '10px 20px', margin: '5px' }}>
                Go to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div className="wishlist-card" key={item.id}>
                <div className="card-img">
                  <Link to={`/collectiondetails/${item.productId}`}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23f0f0f0' width='300' height='200'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EProduct Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </Link>
                  {item.originalPrice > item.price && (
                    <span className="discount">
                      {Math.round(
                        ((item.originalPrice - item.price) /
                          item.originalPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.id)}
                    disabled={removingItem === item.id}
                  >
                    {removingItem === item.id ? "..." : "❌"}
                  </button>
                </div>

                <div className="card-body">
                  <span className="category">{item.category}</span>
                  <Link to={`/collectiondetails/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3>{item.name}</h3>
                  </Link>
                  {item.rating > 0 && (
                    <div className="rating">
                      ⭐ {item.rating.toFixed(1)} <span>({item.reviewCount} reviews)</span>
                    </div>
                  )}
                  <div className="price">
                    ₹{item.price.toLocaleString()}
                    {item.originalPrice > item.price && (
                      <span className="old-price">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="added">
                    Added:{" "}
                    {new Date(item.addedDate).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  <button
                    className="add-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Share Modal */}
        {shareModalVisible && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div
              className="modal"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <h3>Share Your Wishlist</h3>
              <div className="modal-content">
                <input type="text" value={shareUrl} readOnly />
                <button onClick={handleCopyLink}>📋 Copy</button>
              </div>
              <div className="modal-footer">
                <button onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
