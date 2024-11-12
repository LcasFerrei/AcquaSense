import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from "../../components/AcquaNav/Header";
import Dash from "../../components/Dashboard/Dash";
import './DashHome.css';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="dashboard-logo-menu">
          <div className="dashboard-logo">
            <a href="/Dashboard" className="dashboard-logo-link">
              <h1>AcquaSense</h1>
            </a>
          </div>
          <nav className="dashboard-nav">
          <ul>
            <li><a href="/Userpage"><i className="fa-solid fa-user"></i><span> Meu Perfil</span></a></li>
            <li><a href="/Dashboard"><i className="fas fa-chart-line"></i><span> Dashboard</span></a></li>
            <li><a href="/Consumptiondaily"><i className="fas fa-tint"></i><span> Consumo Diário</span></a></li>
            <li><a href="/Maintenance"><i className="fas fa-tools"></i><span> Manutenção</span></a></li>
            <li><a href="/SpecificMonitoring"><i className="fas fa-eye"></i><span> Monitoramento Específico</span></a></li>
            <li><a href="/Configuration"><i className="fa-solid fa-gear"></i><span> Configuração</span></a></li>
            <li><a href="/" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><span> Logout</span></a></li>
          </ul>
          </nav>
        </div>
      </aside>
      <div className={`dashboard-main-content ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
        <HeaderNav handleMenuToggle={handleMenuToggle} />
        <Dash />
      </div>
    </div>
  );
}

export default Dashboard;
