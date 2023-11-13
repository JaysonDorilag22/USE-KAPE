import React from 'react';
import Sidebar from './Sidebar';

export default function PostTable() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <div>PostTable</div>
      </div>
    </div>
  );
}
