import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Header from './components/Header';
import Home from "./pages/Home";
import Signin from "./components/user/SignIn";
import SignUp from "./components/user/SignUp";
import ForgotPassword from "./components/user/ForgotPassword";
import Profile from "./components/user/Profile";
import Footer from "./components/Footer";
import NewPassword from "./components/user/NewPassword";
import CategoryList from "./components/ecommerce/category/CategoryCard";
import Cart from "./components/ecommerce/cart/Cart";
import PagenotFound from "./pages/PagenotFound";

// Admin pages
import AdminPanel from "./components/admin/AdminPanel";
import CategoryTable from "./components/admin/CategoryTable";
import ProductTable from "./components/admin/ProductTable";
import OrderTable from "./components/admin/OrderTable";
import PostTable from "./components/admin/PostTable";
import CreateCategory from "./components/ecommerce/category/CreateCategory";

const AdminRoutesWrapper = ({ element }) => {
  const userRole = useSelector((state) => state.user.currentUser?.role);

  if (userRole !== "Admin") {
    return <Navigate to="/" />;
  }

  return element;
};

const App = () => {
  return (
    <Router>
      <>
        <Header />
        <Routes>
          {/* Routes for all users */}
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<NewPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/category-list" element={<CategoryList />} />

          {/* Routes for Admin only - using AdminRoutesWrapper */}
          <Route
            path="/dashboard/*"
            element={<AdminRoutesWrapper element={<AdminPanel />} />}
          />
          <Route
            path="/category-table"
            element={<AdminRoutesWrapper element={<CategoryTable />} />}
          />
          <Route
            path="/product-table"
            element={<AdminRoutesWrapper element={<ProductTable />} />}
          />
          <Route
            path="/post-table"
            element={<AdminRoutesWrapper element={<PostTable />} />}
          />
          <Route
            path="/order-table"
            element={<AdminRoutesWrapper element={<OrderTable />} />}
          />
          <Route
            path="/create-category"
            element={<AdminRoutesWrapper element={<CreateCategory />} />}
          />

          {/* Redirect to Home for unknown routes */}
          <Route path="*" element={<PagenotFound />} />
        </Routes>
        <Footer />
      </>
    </Router>
  );
};

export default App;
