import React from 'react';
import Sidebar from './Sidebar';

export default function OrderTable() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <div>OrderTable</div>
      </div>
    </div>
  );
}
