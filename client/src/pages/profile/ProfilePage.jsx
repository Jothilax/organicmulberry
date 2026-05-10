import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { authService } from "../../services/authService";
import { orderService } from "../../services/orderService";
import { couponService } from "../../services/couponService";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import logo from "../../../public/organicmulberrylogo.png";
import signature from "../../../public/signature.png";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [coupons, setCoupons] = useState({
    available: [],
    used: [],
    expired: []
  });
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('customerToken');
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        
        // Fetch user profile
        const profileResponse = await authService.getProfile();
        if (profileResponse.customer) {
          setUser(profileResponse.customer);
          setEditForm({
            name: profileResponse.customer.name || "",
            email: profileResponse.customer.email || "",
            phone: profileResponse.customer.phone || "",
            gender: profileResponse.customer.gender || "",
            address: profileResponse.customer.address || "",
            country: profileResponse.customer.country || "",
            state: profileResponse.customer.state || "",
            city: profileResponse.customer.city || "",
            pincode: profileResponse.customer.pincode || "",
            landmark: profileResponse.customer.landmark || ""
          });
        }

        // Fetch orders
        try {
          const ordersResponse = await orderService.getMyOrders();
          if (Array.isArray(ordersResponse)) {
            setOrders(ordersResponse);
          }
        } catch (orderError) {
          console.error("Error fetching orders:", orderError);
        }

        // Fetch coupons from API
        try {
          const couponsResponse = await couponService.getAvailableCoupons();
          if (couponsResponse.coupons) {
            const now = new Date();
            const available = [];
            const expired = [];

            couponsResponse.coupons.forEach(coupon => {
              if (coupon.expiry_date && new Date(coupon.expiry_date) < now) {
                expired.push(coupon);
              } else {
                available.push(coupon);
              }
            });

            setCoupons({
              available,
              used: [],
              expired
            });
          }
        } catch (couponError) {
          console.error("Error fetching coupons:", couponError);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original user data
    if (user) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        address: user.address || "",
        country: user.country || "",
        state: user.state || "",
        city: user.city || "",
        pincode: user.pincode || "",
        landmark: user.landmark || ""
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await authService.updateProfile(editForm);
      if (response.customer) {
        setUser(response.customer);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      authService.logout();
    }
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getDiscountText = (coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    } else {
      return `₹${coupon.discount_value} OFF`;
    }
  };

//   const downloadInvoice = async (order) => {
//   const invoice = document.getElementById(`invoice-${order.id}`);

//   const canvas = await html2canvas(invoice, {
//     scale: 2,
//     useCORS: true,
//     backgroundColor: "#ffffff",
//   });

//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF("p", "mm", "a4");

//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//   pdf.save(`Invoice-${order.order_code || order.id}.pdf`);
// };

// const downloadInvoice = async (order) => {
//   try {
//     const response = await fetch(
//       `http://localhost:3000/api/order/generateOrderPDF/${order.id}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Invoice download failed");
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `Invoice-${order.order_code || order.id}.pdf`;
//     document.body.appendChild(link);
//     link.click();

//     link.remove();
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error("Invoice download error:", error);
//     alert("Failed to download invoice");
//   }
// };

// const downloadInvoice = async (order) => {
//   try {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Session expired. Please login again.");
//       return;
//     }

//     const response = await fetch(
//       `http://localhost:3000/api/order/generateOrderPDF/${order.id}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (response.status === 401) {
//       alert("Session expired. Please login again.");
//       localStorage.clear();
//       window.location.href = "/login";
//       return;
//     }

//     if (!response.ok) {
//       throw new Error("Invoice download failed");
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `Invoice-${order.order_code}.pdf`;
//     document.body.appendChild(link);
//     link.click();

//     link.remove();
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error("Invoice download error:", error);
//     alert("Failed to download invoice");
//   }
// };


// const downloadInvoice = async (order) => {
//   try {
//     const response = await fetch(
//       `http://localhost:3000/api/order/generateOrderPDF/${order.id}`,
//       {
//         method: "GET",
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Invoice download failed");
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `Invoice-${order.order_code || order.id}.pdf`;
//     document.body.appendChild(link);
//     link.click();

//     link.remove();
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error("Invoice download error:", error);
//     alert("Failed to download invoice");
//   }
// };


// const downloadInvoice = async (order) => {
//   try {
//     const token = localStorage.getItem("customerToken");

//     if (!token) {
//       alert("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     const response = await fetch(
//       `http://16.171.20.13:5000/api/order/generateOrderPDF/${order.id}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`, // ✅ CORRECT TOKEN
//         },
//       }
//     );

//     if (response.status === 401) {
//       alert("Session expired. Please login again.");
//       localStorage.removeItem("customerToken");
//       navigate("/login");
//       return;
//     }

//     if (!response.ok) {
//       throw new Error("Invoice download failed");
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `Invoice-${order.order_code || order.id}.pdf`;
//     document.body.appendChild(link);
//     link.click();

//     link.remove();
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error("Invoice download error:", error);
//     alert("Failed to download invoice");
//   }
// };

const handleDownloadInvoice = async (order) => {
  try {
    const blob = await orderService.downloadInvoice(order.id);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.order_code || order.id}.pdf`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Invoice download error:', error);
    alert('Failed to download invoice');
  }
};
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user ? (user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()) : "U"}
        </div>
        <div className="profile-info">
          <h2>{user ? (user.name || "User") : "User Name"}</h2>
          <p>{user ? user.email : "user@email.com"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "coupons" ? "active" : ""}
          onClick={() => setActiveTab("coupons")}
        >
          My Coupons
        </button>
        <button
          className={activeTab === "personal" ? "active" : ""}
          onClick={() => setActiveTab("personal")}
        >
          Personal Info
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      {/* Tabs Content */}
      <div className="tab-content">
        {activeTab === "coupons" && (
          <div className="coupons-section">
            <h3>My Coupons</h3>
            
            {/* Available Coupons */}
            <div className="coupon-category">
              <h4>Available Coupons ({coupons.available.length})</h4>
              {coupons.available.length === 0 ? (
                <p className="no-coupons">No available coupons at the moment.</p>
              ) : (
                <div className="coupons-grid">
                  {coupons.available.map((c, i) => (
                    <div className="coupon-card" key={i}>
                      <div className="coupon-header">
                        <span className="coupon-discount">{getDiscountText(c)}</span>
                        {c.min_purchase > 0 && (
                          <span className="coupon-min">Min. ₹{c.min_purchase}</span>
                        )}
                      </div>
                      <div className="coupon-body">
                        <h4 className="coupon-code">{c.code}</h4>
                        <p className="coupon-description">{c.description || 'Special offer coupon'}</p>
                        {c.expiry_date && (
                          <small className="coupon-expiry">
                            Expires: {formatDate(c.expiry_date)}
                          </small>
                        )}
                      </div>
                      <button
                        className="copy-btn"
                        onClick={() => copyCouponCode(c.code)}
                      >
                        {copiedCode === c.code ? '✓ Copied!' : 'Copy Code'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expired Coupons */}
            {coupons.expired.length > 0 && (
              <div className="coupon-category">
                <h4>Expired Coupons ({coupons.expired.length})</h4>
                <div className="coupons-grid">
                  {coupons.expired.map((c, i) => (
                    <div className="coupon-card expired" key={i}>
                      <div className="coupon-header">
                        <span className="coupon-discount">{getDiscountText(c)}</span>
                      </div>
                      <div className="coupon-body">
                        <h4 className="coupon-code">{c.code}</h4>
                        <p className="coupon-description">{c.description || 'Special offer coupon'}</p>
                        {c.expiry_date && (
                          <small className="coupon-expiry expired-text">
                            Expired: {formatDate(c.expiry_date)}
                          </small>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "personal" && (
          <div className="info-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Personal Information</h3>
              {!isEditing && (
                <button 
                  onClick={handleEdit}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#eab308',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : isEditing ? (
              <div className="edit-form" style={{ maxWidth: '600px' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Gender</label>
                  <select
                    name="gender"
                    value={editForm.gender}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Address</label>
                  <textarea
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={editForm.country}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>State</label>
                    <input
                      type="text"
                      name="state"
                      value={editForm.state}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>City</label>
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={editForm.pincode}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={editForm.landmark}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#eab308',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: '500',
                      opacity: saving ? 0.7 : 1
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>Name:</strong> {user ? user.name || "Not set" : "User"}
                </p>
                <p>
                  <strong>Email:</strong> {user ? user.email : "user@email.com"}
                </p>
                <p>
                  <strong>Phone:</strong> {user ? user.phone || "Not set" : "Not set"}
                </p>
                {user?.gender && (
                  <p>
                    <strong>Gender:</strong> {user.gender}
                  </p>
                )}
                {user?.address && (
                  <p>
                    <strong>Address:</strong> {user.address}
                  </p>
                )}
                {user?.country && (
                  <p>
                    <strong>Country:</strong> {user.country}
                  </p>
                )}
                {user?.state && (
                  <p>
                    <strong>State:</strong> {user.state}
                  </p>
                )}
                {user?.city && (
                  <p>
                    <strong>City:</strong> {user.city}
                  </p>
                )}
                {user?.pincode && (
                  <p>
                    <strong>Pincode:</strong> {user.pincode}
                  </p>
                )}
                {user?.landmark && (
                  <p>
                    <strong>Landmark:</strong> {user.landmark}
                  </p>
                )}
                <p>
                  <strong>Joined:</strong>{" "}
                  {user && user.createdAt
                    ? formatDate(user.createdAt)
                    : user
                    ? formatDate(new Date())
                    : "Jan 2024"}
                </p>
              </>
            )}
          </div>
        )}

{activeTab === "orders" && (
  <div className="info-box">
    <h3>Order History</h3>

    {loading ? (
      <p>Loading orders...</p>
    ) : orders.length === 0 ? (
      <p>No orders yet.</p>
    ) : (
      <div className="orders-list">
        {orders.map((order) => (
          <div
            key={order.id}
            className="order-card"
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "5px"
            }}
          >
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h4
                  style={{ cursor: "pointer", color: "#eab308" }}
                  onClick={() => navigate(`/order/${order.id}`)}
                >
                  Order {order.order_code || `#${order.id?.substring(0, 8)}`}
                </h4>
                <p style={{ color: "#666", fontSize: "0.9em" }}>
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: "bold" }}>
                  ₹{order.total_amount?.toLocaleString()}
                </p>
                <p
                  style={{
                    color:
                      order.status === "completed"
                        ? "green"
                        : order.status === "pending"
                        ? "orange"
                        : "gray"
                  }}
                >
                  {order.status || "Pending"}
                </p>
              </div>
            </div>

            {/* QR CODE */}
            {order.qr_code && (
              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <p><b>Order QR Code</b></p>
                <img src={order.qr_code} alt="QR" style={{ maxWidth: "200px" }} />
              </div>
            )}

            {/* ITEMS */}
            {order.items?.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <b>Items:</b>
                {order.items.map((item, index) => (
                  <p key={index}>
                    {item.product?.name} × {item.quantity} — ₹{item.price}
                  </p>
                ))}
              </div>
            )}

            {/* ADDRESS & PAYMENT */}
            {order.address && <p><b>Address:</b> {order.address}</p>}
            <p><b>Payment:</b> {order.payment_method || "COD"}</p>

            {/* DOWNLOAD BUTTON */}
            <button
              onClick={() => handleDownloadInvoice(order)}
              style={{
                marginTop: "10px",
                padding: "0.5rem 1rem",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Download Invoice
            </button>

       
          </div>
        ))}
      </div>
    )}
  </div>
)}


        {activeTab === "settings" && (
          <div className="info-box">
            <h3>Account Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
              <button
                onClick={() => {
                  setActiveTab("personal");
                  setIsEditing(true);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#eab308',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
