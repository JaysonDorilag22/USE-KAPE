import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import logo from "../assets/images/logo.png";
import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from "../../src/redux/user/userSlice.js";
import { clearCart } from "../../src/redux/cart/cartSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      dispatch(clearCart());
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

  const totalItems = cart.length;

  return (
    <header className="bg-white-600 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <img src={logo} alt="Logo" className="h-10 w-15" />
        </Link>
        {currentUser ? (
          <div className="flex items-center">
            <div className="dropdown dropdown-end ml-2">
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
                    {cart &&
                      cart.map((item) => (
                        <li
                          key={item._id}
                          className="flex items-center justify-between py-2"
                        >
                          <span>
                            <img
                              src={item.imageUrls && item.imageUrls[0]}
                              alt=""
                              className="h-16 w-16 rounded object-cover"
                            />
                          </span>
                          <span className="ml-5">{item.name}</span>
                          <span>{item.quantity}</span>
                        </li>
                      ))}
                  </ul>
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd>
                      ${" "}
                      {cart
                        .reduce(
                          (total, item) => total + item.quantity * item.price,
                          0
                        )
                        .toFixed(2)}
                    </dd>
                  </div>

                  <div className="card-actions">
                    <Link to="/cart">
                      <button className="mt-2 w-full rounded border border-slate-600 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring active:bg-slate-500">
                        Checkout
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="dropdown dropdown-end ml-5">
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
                  <Link to="/feed" className="justify-between">
                    Social
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
              <button className="inline-block rounded border border-slate-600 bg-slate-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-slate-600 focus:outline-none focus:ring active:text-slate-500">
                Log in
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="inline-block rounded border border-slate-600 px-12 py-3 text-sm font-medium text-slate-600 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring active:bg-slate-500 ml-3">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
