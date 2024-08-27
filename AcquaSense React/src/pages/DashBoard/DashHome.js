// Dashboard.js
import React from 'react';
import HeaderNav from "../../components/AcquaNav/Header";
import Dash from "../../components/Dashboard/Dash";
import './DashHome.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <HeaderNav />
      <Dash />
    </div>
  );
}

export default Dashboard;
