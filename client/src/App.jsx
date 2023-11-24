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
import UserOrder from "./components/ecommerce/UserOrder";
import OrderDetails from "./components/ecommerce/OrderDetails";

import Footer from "./components/Footer";
import NewPassword from "./components/user/NewPassword";
import CategoryList from "./components/ecommerce/Category/CategoryCard";
import Cart from "./components/ecommerce/Cart/Cart";
import Checkout from "./components/ecommerce/Cart/Checkout";
import OrderSucess from "./components/ecommerce/Cart/OrderSucess";
import PagenotFound from "./pages/PagenotFound";

// Admin pages
import AdminPanel from "./components/admin/AdminPanel";
import CategoryTable from "./components/admin/Category/CategoryTable";
import UpdateCategory from "./components/admin/Category/UpdateCategory";
import ProductTable from "./components/admin/Product/ProductTable";
import UpdateProduct from "./components/admin/Product/UpdateProduct";
import OrderTable from "./components/admin/Order/OrderTable";
import PostTable from "./components/admin/Post/PostTable";
import AdminOrderDetails from "./components/admin/Order/AdminOrderDetails";

import ProductDetails from "./components/ecommerce/Product/ProductDetails";


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
          <Route path="/orders" element={<UserOrder />} />
          <Route path="/order-details/:orderId" element={<OrderDetails />} />

          
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/sucess" element={<OrderSucess />} />

          <Route path="/product/:productId" element={<ProductDetails />} />

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
            path='/update-category/:categoryId'
            element={<UpdateCategory />}
          />

          <Route
            path="/product-table"
            element={<AdminRoutesWrapper element={<ProductTable />} />}
          />
          <Route
            path='/update-product/:productId'
            element={<UpdateProduct />}
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
            path="/orderdetails/:orderId"
            element={<AdminRoutesWrapper element={<AdminOrderDetails />} />}
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
