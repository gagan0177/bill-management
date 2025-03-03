import React from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css"; // Import CSS for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="text-xl">Bill Management</h2>
      <ul>
        <li>
          <Link to="customers">Customers List</Link>
        </li>
        <li>
          <Link to="bill-generator">Bill Generator</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
