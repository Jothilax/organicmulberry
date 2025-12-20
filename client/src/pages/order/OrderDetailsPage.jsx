import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { orderService } from "../../services/orderService";
import "./OrderDetailsPage.css";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orders = await orderService.getMyOrders();
        const foundOrder = orders.find(o => o.id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          alert("Order not found");
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        alert("Failed to load order details");
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, navigate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "#10b981";
      case "shipped": return "#3b82f6";
      case "paid": return "#8b5cf6";
      case "pending": return "#f59e0b";
      case "cancelled": return "#ef4444";
      default: return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div className="order-details-container">
        <div className="loading-spinner">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-container">
        <div className="error-message">Order not found</div>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <Link to="/profile" className="back-link">
          ← Back to Orders
        </Link>
        <h1>Order Details</h1>
      </div>

      <div className="order-details-content">
        {/* Order Summary Card */}
        <div className="order-card">
          <div className="order-card-header">
            <div>
              <h2>Order {order.order_code || `#${order.id?.substring(0, 8)}`}</h2>
              <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
              {order.status || "Pending"}
            </div>
          </div>

          {/* QR Code Section */}
          {order.qr_code && (
            <div className="qr-code-section">
              <h3>Order QR Code</h3>
              <div className="qr-code-wrapper">
                <img 
                  src={order.qr_code} 
                  alt="Order QR Code" 
                  className="qr-code-image"
                />
                <p className="qr-code-note">Scan to view order details</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="order-items-section">
            <h3>Order Items</h3>
            {order.items && order.items.length > 0 ? (
              <div className="items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <h4>{item.product?.name || "Unknown Product"}</h4>
                      <p className="item-details">
                        Quantity: {item.quantity} × ₹{item.price?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="item-total">
                      ₹{(item.quantity * (item.price || 0)).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No items found</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{order.total_amount?.toLocaleString() || '0'}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{order.total_amount?.toLocaleString() || '0'}</span>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="order-info-grid">
            <div className="info-card">
              <h3>Shipping Address</h3>
              <p>{order.address || "No address provided"}</p>
            </div>
            <div className="info-card">
              <h3>Payment Method</h3>
              <p>{order.payment_method || "Cash on Delivery (COD)"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

