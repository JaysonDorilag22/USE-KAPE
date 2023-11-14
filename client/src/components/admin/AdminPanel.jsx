import React from "react";
import Sidebar from "../Sidebar";
import Dashboard from "./Dashboard"; 
import Graphs from "./Graphs";

export default function AdminPanel() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Dashboard />
        <Graphs />
      </div>
    </div>
  );
}
