import React, { useState } from 'react';
import HeaderNav from "../../components/AcquaNav/Header";
import MonitoramentoAgua from "../../components/Monitoramento/Monitoramento";
import './HomeMonitoring.css';

function MonitoringHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Aqui você pode adicionar a lógica de logout, como limpar tokens ou informações de sessão
    console.log("Usuário deslogado");
    // Redirecionar para a raiz da página
    window.location.href = '/';
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="dashboard-logo-menu">
          <div className="dashboard-logo">
            <a href="/index.html" className="dashboard-logo-link">
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

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
        <HeaderNav handleMenuToggle={handleMenuToggle} />
        <div className="monitoramento-container">
          {/* Conteúdo do Monitoramento */}
          <MonitoramentoAgua />
        </div>
      </div>
    </div>
  );
}

export default MonitoringHome;
