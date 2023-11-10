import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Signin from "./components/user/SignIn";
import SignUp from "./components/user/SignUp";
import ForgotPassword from "./components/user/ForgotPassword";
import Profile from "./components/user/Profile";
import Footer from "./components/Footer";
import NewPassword from "./components/user/NewPassword";
import CreateCategory from "./components/ecommerce/category/CreateCategory";
import CategoryList from "./components/ecommerce/category/CategoryList";
import Cart from "./components/ecommerce/cart/Cart";
import PagenotFound from "./pages/PagenotFound";

const App = () => {
  const userRole = useSelector((state) => state.user.currentUser?.role);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Footer />
            </>
          }
        />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<NewPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category-list" element={<CategoryList />} />
        {/* ========================================================= */}
        <Route
          path="/create-category"
          element={
            userRole === "User" || !userRole ? (
              <Navigate to="/" />
            ) : (
              <CreateCategory />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            userRole === "User" || !userRole ? (
              <Navigate to="/" />
            ) : (
              <AdminPanel />
            )
          }
        />
        {/* Redirect to Home for unknown routes */}
        <Route path="*" element={<PagenotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
