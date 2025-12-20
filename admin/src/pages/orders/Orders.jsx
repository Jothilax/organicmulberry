import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../services/orderService";
import styles from "./orders.module.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setProducts(order.items || []);
  };

  if (loading) return <div className={styles.loader}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2>Orders</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order Code</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Payment Method</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => handleOrderClick(order)}
              className={styles.row}
            >
              <td>
                <strong>
                  {order.order_code ||
                    `ORD-${order.id.substring(0, 8).toUpperCase()}`}
                </strong>
              </td>
              <td>{order.customer?.name || "-"}</td>
              <td>{order.customer?.email || "-"}</td>
              <td>{order.customer?.phone || "-"}</td>
              <td>₹{order.total_amount?.toLocaleString() || "0"}</td>
              <td>
                <span className={styles.status} data-status={order.status}>
                  {order.status || "pending"}
                </span>
              </td>
              <td>{order.payment_method || "-"}</td>
              <td>
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className={styles.products}>
          <h3>
            Products in Order{" "}
            {selectedOrder.order_code || selectedOrder.id.substring(0, 8)}
          </h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id || `${p.product?.id}-${p.quantity}`}>
                  <td>
                    <strong>{p.product?.name}</strong>
                  </td>
                  <td>{p.quantity}</td>
                  <td>₹{p.price?.toLocaleString() || "0"}</td>
                  <td>₹{((p.price || 0) * (p.quantity || 0)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedOrder.address && (
            <div className={styles.addressSection}>
              <h4>Delivery Address</h4>
              <p>{selectedOrder.address}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;

