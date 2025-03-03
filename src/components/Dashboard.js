import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import CustomersList from "./CustomersList";
import BillGenerator from "./BillGenerator";
import "../styles/dashboard.css";
const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/bill-generator" element={<BillGenerator />} />
          <Route path="/" element={<Navigate to="customers" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
