import React from 'react';
import Sidebar from './Sidebar';

export default function ProductTable() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <div>ProductTable</div>
      </div>
    </div>
  );
}
