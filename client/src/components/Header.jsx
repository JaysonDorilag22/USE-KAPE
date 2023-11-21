import { useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/images/logo.png";
import { FiShoppingCart } from "react-icons/fi";
import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from "../../src/redux/user/userSlice.js";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const initialCart = JSON.parse(localStorage.getItem("cartItems")) || [];
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  // Calculate the total items in the cart
  // const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalItems = cart.length;
  return (
    <header className="bg-white-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <img src={logo} alt="Logo" className="h-10 w-15" />
        </Link>
        {currentUser ? (
          <div className="flex items-center">
            <div className="dropdown dropdown-end ml-2">
              {/* Cart dropdown */}
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <FiShoppingCart className="h-5 w-5" />
                  <span className="badge badge-sm indicator-item">
                    {totalItems}
                  </span>
                </div>
              </label>
              <div className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
                <div className="card-body">
                  <span className="font-bold text-lg">{totalItems} Items</span>
                  <ul className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <li
                        key={item._id}
                        className="flex items-center justify-between py-2"
                      >
                        <span>
                          <img
                            src={item.imageUrls[0]} // Replace with the actual image URL
                            // src={product.imageUrls[0]}

                            alt=""
                            className="h-16 w-16 rounded object-cover"
                          />
                        </span>
                        <span>{item.name}</span>
                        <span>{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="card-actions">
                    <Link to="/cart">
                      <button className="block rounded w-full bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600">
                        Checkout
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="dropdown dropdown-end ml-5">
              {/* Avatar dropdown */}
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                {currentUser ? (
                  <div className="w-10 rounded-full">
                    <img src={currentUser.avatar} alt="profile" />
                  </div>
                ) : (
                  <li className="text-slate-700 hover:underline"> Sign in</li>
                )}
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/orders">
                    Orders
                    <div className="badge badge-error bg-red-600 text-white badge-sm">
                      34
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={handleSignOut}>
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <Link to="/sign-in">
              <a className="inline-block rounded border border-slate-600 bg-slate-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-slate-600 focus:outline-none focus:ring active:text-slate-500">
                Log in
              </a>
            </Link>
            <Link to="/sign-up">
              <a className="inline-block rounded border border-slate-600 px-12 py-3 text-sm font-medium text-slate-600 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring active:bg-slate-500 ml-3">
                Register
              </a>
            </Link>

            {/* Base */}

            {/* Border */}
          </div>
        )}
      </div>
    </header>
  );
}
