import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header/Header";
import Category from "./pages/category/Category";
import ProductList from "./pages/product/ProductList";
import AddProduct from "./pages/product/AddProduct";
import EditProduct from "./pages/product/EditProduct";
import Customer from "./pages/customers/Customer";
import Coupon from "./pages/masters/Coupon";
import Color from "./pages/masters/Color";
import Size from "./pages/masters/Size";
import Login from "./pages/login/Login";
import Role from './pages/users/Role'
import Users from './pages/users/User'
import Orders from './pages/orders/Orders'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check if user already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // ✅ On successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      {/* ✅ Show Header only when logged in */}
      {isLoggedIn && <Header onLogout={handleLogout} />}

      <Routes>
        {/* ===================== PUBLIC ROUTE ===================== */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/category" />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* ===================== DEFAULT ROUTE ===================== */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/category" /> : <Navigate to="/login" />
          }
        />

        {/* ===================== PROTECTED ROUTES ===================== */}
        <Route
          path="/category"
          element={isLoggedIn ? <Category /> : <Navigate to="/login" />}
        />
        <Route
          path="/products"
          element={isLoggedIn ? <ProductList /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-product"
          element={isLoggedIn ? <AddProduct /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-product/:id"
          element={isLoggedIn ? <EditProduct /> : <Navigate to="/login" />}
        />
        <Route
          path="/customers"
          element={isLoggedIn ? <Customer /> : <Navigate to="/login" />}
        />
        <Route
          path="/users"
          element={isLoggedIn ? <Users /> : <Navigate to="/login" />}
        />
        <Route
          path="/role"
          element={isLoggedIn ? <Role /> : <Navigate to="/login" />}
        />
        <Route
          path="/coupon"
          element={isLoggedIn ? <Coupon /> : <Navigate to="/login" />}
        />
        <Route
          path="/orders"
          element={isLoggedIn ? <Orders /> : <Navigate to="/login" />}
        />
         <Route
          path="/color"
          element={isLoggedIn ? <Color /> : <Navigate to="/login" />}
        />
         <Route
          path="/size"
          element={isLoggedIn ? <Size /> : <Navigate to="/login" />}
        />
        
      </Routes>
    </Router>
  );
}

export default App;
