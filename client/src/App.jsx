import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ProductsPage from "./pages/product/ProductsPage"
import ProductDetails from "./pages/product/ProductDetails"
import ContactPage from "./pages/contact/ContactPage"
import AboutPage from "./pages/about/AboutPage"
import CartPage from "./pages/cart/CartPage"
import CheckoutPage from "./pages/checkout/CheckoutPage"
import WishlistPage from "./pages/wishlist/WishlistPage"
import ForgotPasswordPage from "./pages/forgetpassword/ForgotPasswordPage"
import ResetPasswordPage from "./pages/resetpassword/ResetPasswordPage"
import LoginPage from "./pages/login/LoginPage"
import OtpVerificationPage from "./pages/otp/OtpVerificationPage"
// import RegisterPage from "./pages/registration/RegisterPage"
import ProfilePage from "./pages/profile/ProfilePage"
import OrderDetailsPage from "./pages/order/OrderDetailsPage"
import EcommerceHeader from "./components/header/EcommerceHeader"
import EcommerceFooter from "./components/footer/EcommerceFooter"

function App() {
  return (
    <BrowserRouter>
      <EcommerceHeader/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collection" element={<ProductsPage />} />
        <Route path="/collectiondetails/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/forgetpassword" element={<ForgotPasswordPage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otpverify" element={<OtpVerificationPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
      </Routes>
      <EcommerceFooter/>
    </BrowserRouter>
  );
}

export default App;
