import React from "react";
import Sidebar from "../Sidebar";
import Dashboards from "./Dashboards";

export default function AdminPanel() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Dashboards />
      </div>
    </div>
  );
}
