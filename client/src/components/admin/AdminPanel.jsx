import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Graphs from './Graphs';
import ProductTable from './ProductTable';
import PostTable from './PostTable';
import OrderTable from './OrderTable';
import CategoryTable from './CategoryTable';

export default function AdminPanel() {
  return (
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/graphs" element={<Graphs />} />
        <Route path="/categories" element={<CategoryTable />} />
        <Route path="/posts" element={<PostTable />} />
        <Route path="/products" element={<ProductTable />} />
        <Route path="/orders" element={<OrderTable />} />
      </Routes>
    </div>
  );
}
