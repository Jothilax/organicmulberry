import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import { cartService } from "../../services/cartService";
import { orderService } from "../../services/orderService";
import { authService } from "../../services/authService";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
    upiId: "",
  });
  const [cartSummary, setCartSummary] = useState({
    itemCount: 0,
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    appliedCoupon: null,
    items: [],
  });

  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem('customerToken');
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        
        // Fetch cart
        const cartResponse = await cartService.getCart();
        if (cartResponse.items && cartResponse.items.length > 0) {
          const items = cartResponse.items;
          const subtotal = cartResponse.total || items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
          const tax = subtotal * 0.05;
          const total = subtotal + tax;

          setCartSummary({
            itemCount: items.length,
            subtotal,
            discount: 0,
            tax,
            total,
            appliedCoupon: null,
            items,
          });
        } else {
          // Cart is empty
          navigate("/cart");
        }

        // Fetch user profile to pre-fill form
        try {
          const profileResponse = await authService.getProfile();
          if (profileResponse.customer) {
            const customer = profileResponse.customer;
            setFormData(prev => ({
              ...prev,
              firstName: customer.name?.split(' ')[0] || "",
              lastName: customer.name?.split(' ').slice(1).join(' ') || "",
              email: customer.email || "",
              address: customer.address || "",
              city: customer.city || "",
              state: customer.state || "",
              zipCode: customer.pincode || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
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

    fetchCartData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartSummary.itemCount === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setSubmitting(true);

      // Build address string
      const addressParts = [
        formData.address,
        formData.city,
        formData.state,
        formData.zipCode,
      ].filter(Boolean);
      const fullAddress = addressParts.join(", ");

      // Map payment method
      let paymentMethodMapping = "COD";
      if (paymentMethod === "card") {
        paymentMethodMapping = "CARD";
      } else if (paymentMethod === "upi") {
        paymentMethodMapping = "UPI";
      } else if (paymentMethod === "paypal") {
        paymentMethodMapping = "PAYPAL";
      }

      // Create order
      const orderResponse = await orderService.createOrder(
        paymentMethodMapping,
        fullAddress
      );

      if (orderResponse.order) {
        alert(`Order placed successfully! Order ID: ${orderResponse.order.id}`);
        navigate("/profile");
      } else {
        alert("Order placed successfully!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-empty">
        <h2>Loading checkout...</h2>
      </div>
    );
  }

  if (cartSummary.itemCount === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some items before proceeding to checkout.</p>
        <Link to="/collection" className="btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="back-link">
        <Link to="/cart">← Back to Cart</Link>
      </div>

      <h1>Checkout</h1>

      <div className="checkout-grid">
        {/* Form Section */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input name="state" value={formData.state} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input name="zipCode" value={formData.zipCode} onChange={handleChange} required />
            </div>
          </div>

          <h2>Payment Information</h2>

          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery (COD)
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit / Debit Card
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayPal
            </label>
          </div>

          {paymentMethod === "card" && (
            <>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry (MM/YY)</label>
                  <input name="expiry" value={formData.expiry} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input name="cvv" value={formData.cvv} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input name="cardName" value={formData.cardName} onChange={handleChange} required />
                </div>
              </div>
            </>
          )}

          {paymentMethod === "upi" && (
            <div className="form-group">
              <label>UPI ID</label>
              <input
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="yourname@upi"
                required
              />
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Placing Order..." : `Place Order - ₹${cartSummary.total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          {cartSummary.items && cartSummary.items.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              {cartSummary.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px 0',
                  borderBottom: index < cartSummary.items.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <span>{item.product?.name || 'Product'} x {item.quantity}</span>
                  <span>₹{item.subtotal?.toLocaleString() || '0'}</span>
                </div>
              ))}
            </div>
          )}

          {cartSummary.appliedCoupon && (
            <div className="coupon-box">
              <span>🎁 {cartSummary.appliedCoupon.code}</span>
              <p>{cartSummary.appliedCoupon.description}</p>
            </div>
          )}

          <div className="summary-line">
            <span>Subtotal ({cartSummary.itemCount} items)</span>
            <span>₹{cartSummary.subtotal.toLocaleString()}</span>
          </div>

          {cartSummary.discount > 0 && (
            <div className="summary-line green">
              <span>Discount ({cartSummary.appliedCoupon?.code})</span>
              <span>-₹{cartSummary.discount.toLocaleString()}</span>
            </div>
          )}

          <div className="summary-line">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="summary-line">
            <span>Tax (5%)</span>
            <span>₹{cartSummary.tax.toFixed(2)}</span>
          </div>

          <hr />

          <div className="summary-total">
            <strong>Total</strong>
            <strong>₹{cartSummary.total.toFixed(2)}</strong>
          </div>

          {cartSummary.discount > 0 && (
            <p className="save-text">🎉 You saved ₹{cartSummary.discount.toLocaleString()}!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
