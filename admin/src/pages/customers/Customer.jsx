
// src/pages/customers/CustomerList.jsx
import React, { useEffect, useState } from "react";
import { getAllCustomers, getCustomerOrders, getOrderProducts } from "../../services/customerService";
import styles from "./customer.module.css";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await getAllCustomers();
      setCustomers(data);
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const handleCustomerClick = async (customer) => {
    setSelectedCustomer(customer);
    setSelectedOrder(null);
    setProducts([]);
    const data = await getCustomerOrders(customer.id);
    setOrders(data);
  };

  const handleOrderClick = async (order) => {
    setSelectedOrder(order);
    const data = await getOrderProducts(order.id);
    setProducts(data);
  };

  if (loading) return <div className={styles.loader}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2>Customers</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Total Orders</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} onClick={() => handleCustomerClick(c)} className={styles.row}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.totalOrders || 0}</td>
              <td>{c.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCustomer && (
        <div className={styles.orders}>
          <h3>Orders for {selectedCustomer.name}</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order Code</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} onClick={() => handleOrderClick(o)} className={styles.row}>
                  <td><strong>{o.order_code || `ORD-${o.id.substring(0, 8).toUpperCase()}`}</strong></td>
                  <td>₹{o.total_amount?.toLocaleString() || "0"}</td>
                  <td>
                    <span className={styles.status} data-status={o.status}>
                      {o.status || "pending"}
                    </span>
                  </td>
                  <td>{o.payment_method || "-"}</td>
                  <td className={styles.address}>{o.address || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className={styles.products}>
          <h3>Products in Order {selectedOrder.order_code || selectedOrder.id}</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id || `${p.product?.id}-${p.quantity}`}>
                  <td><strong>{p.product?.name}</strong></td>
                  <td>{p.quantity}</td>
                  <td>₹{p.price?.toLocaleString() || "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customer;
