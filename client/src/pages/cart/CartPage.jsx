import React, { useState, useEffect } from "react";
import "./CartPage.css";
import { Link, useNavigate } from "react-router-dom";
import { cartService } from "../../services/cartService";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [removingItem, setRemovingItem] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('customerToken');
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await cartService.getCart();
        if (response.items) {
          const formattedItems = response.items.map(item => {
            // Get primary image or first available image
            const primaryImage = item.product?.images?.find(img => img.is_primary) || item.product?.images?.[0];
            const imageUrl = primaryImage?.imageUrl || 
              (primaryImage?.images ? `http://localhost:3000/uploads/products/${primaryImage.images}` : null) ||
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23f0f0f0' width='150' height='150'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
            
            return {
              id: item.id,
              productId: item.product_id,
              name: item.product?.name || "Unknown Product",
              image: imageUrl,
              price: item.product?.price || 0,
              quantity: item.quantity,
              subtotal: item.subtotal || (item.product?.price || 0) * item.quantity,
            };
          });
          setCartItems(formattedItems);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleRemove = async (cartItemId) => {
    try {
      setRemovingItem(cartItemId);
      await cartService.removeFromCart(cartItemId);
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
      alert("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      alert(error.response?.data?.message || "Failed to remove item from cart");
    } finally {
      setRemovingItem(null);
    }
  };

  const applyCoupon = () => {
    if (couponCode === "SAVE10") {
      setDiscount(subtotal * 0.1);
      alert("Coupon applied! 10% off");
    } else {
      alert("Invalid coupon");
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.subtotal,
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax - discount;

  if (loading) {
    return (
      <div className="cart-empty">
        <h2>Loading cart...</h2>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart to continue shopping.</p>
        <Link to="/collection" className="cart-btn">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-card">
              <Link to={`/collectiondetails/${item.productId}`}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23f0f0f0' width='150' height='150'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </Link>
              <div className="cart-details">
                <Link to={`/collectiondetails/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3>{item.name}</h3>
                </Link>
                <p>₹{item.price.toLocaleString()}</p>
                <p>Qty: {item.quantity}</p>
                <p>Subtotal: ₹{item.subtotal.toLocaleString()}</p>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemove(item.id)}
                disabled={removingItem === item.id}
              >
                {removingItem === item.id ? "..." : "✖"}
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-item">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="summary-item">
            <span>Tax (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="summary-item discount">
              <span>Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}

          <hr />

          <div className="summary-item total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="coupon-section">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <button className="apply-btn" onClick={applyCoupon}>
              Apply
            </button>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
