import React from "react";
import { Routes, Route } from "react-router-dom";

// AUTH PAGES
import AdminLogin from "./Pages/Auth/AdminLogin";
import AdminSignUp from "./Pages/Auth/AdminSignUp";

// LAYOUT
import AdminLayout from "./layout/AdminLayout";

// PROTECTED ROUTE
import ProtectedRoute from "./components/ProtectedRoute";

// ADMIN PAGES (Nested)
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import Category from "./Pages/Category/Category";
import Collection from "./Pages/Collection/Collection";
import Product from "./Pages/Product/Product";
import DesktopBanner from "./Pages/Banner/DesktopBanner";
import MobileBanner from "./Pages/Banner/MobileBanner";
import Voucher from "./Pages/Voucher/Voucher";
import Profile from "./Pages/Profile/Profile";
import Discount from "./Pages/Discount/Discount";
import Order from "./Pages/Order/Order";
import OrderDetails from "./Pages/Order/OrderDetails";
import Invoice from "./Pages/Order/Invoice";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<AdminLogin />} />
      <Route path="/signup" element={<AdminSignUp />} />

      {/* ADMIN PROTECTED ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        {/* DEFAULT PAGE INSIDE ADMIN */}
        <Route index element={<AdminDashboard />} />

        {/* Admin Pages */}
        <Route path="category" element={<Category />} />
        <Route path="collection" element={<Collection />} />
        <Route path="product" element={<Product />} />
        <Route path="desktop-banner" element={<DesktopBanner />} />
        <Route path="mobile-banner" element={<MobileBanner />} />
        <Route path="voucher" element={<Voucher />} />
        <Route path="profile" element={<Profile/>} />
        <Route path="discount" element={<Discount/>} />
        <Route path="order" element={<Order />} />
        <Route path="order/:id" element={<OrderDetails />} />  
        <Route path="order/invoice/:id" element={<Invoice />} /> 
      </Route>

    </Routes>
  );
}

export default App;
