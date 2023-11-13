import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { useSelector } from 'react-redux';

export default function Sidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen flex-col justify-between border-e bg-white">
      <div className="px-4 py-6">
        <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
          <img src={logo} alt="Logo" />
        </span>

        <ul className="mt-6 space-y-1">
          <li>
            <Link
              to="/dashboard"
              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive('/dashboard') ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/product-table"
              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive('/product-table') ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              Products
            </Link>
          </li>

          <li>
            <Link
              to="/category-table"
              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive('/category-table') ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              Categories
            </Link>
          </li>

          <li>
            <Link
              to="/post-table"
              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive('/post-table') ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              Post
            </Link>
          </li>

          <li>
            <Link
              to="/order-table"
              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive('/order-table') ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              Orders
            </Link>
          </li>

          <li>
            <Link
              to="/invoices"
              className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                isActive('/invoices') ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              Invoices
            </Link>
          </li>
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
          <img
            alt="Admin"
            src={currentUser.avatar}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div>
            <p className="text-xs">
              <strong className="block font-medium">{currentUser.username}</strong>

              <span> {currentUser.email} </span>
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
