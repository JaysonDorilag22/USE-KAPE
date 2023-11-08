import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./components/user/SignIn";
import SignUp from "./components/user/SignUp";
import ForgotPassword from "./components/user/ForgotPassword";
import Profile from "./components/user/Profile";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewPassword from "./components/user/NewPassword";
import CreateCategory from "./components/ecommerce/category/createCategory";
import CategoryList from "./components/ecommerce/category/CategoryList";


export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<NewPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/category-list" element={<CategoryList />} />
        <Route path="/create-category" element={<CreateCategory />} />
      </Routes>
      <Footer />
    </Router>
  );
}
