import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import DashboardHeaderNav from "../../components/AcquaNav/Header";
import './UserPage.css';
import UserProfile from "../../components/User/User";

function UserHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Inicializando o navigate

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    // Aqui você pode adicionar lógica para limpar tokens ou dados de autenticação
    // Exemplo: localStorage.removeItem('token');

    // Redireciona para a página inicial
    navigate('/'); // Redireciona para a raiz da página
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="dashboard-logo-menu">
          <div className="dashboard-logo">
            <a href="/index.html" className="dashboard-logo-link">
              <h1>AcquaSense</h1>
            </a>
          </div>
          <nav className="dashboard-nav">
            <ul>
              <li><a href="/Userpage"><i className="fa-solid fa-user"></i> Meu Perfil</a></li>
              <li><a href="/Dashboard"><i className="fas fa-chart-line"></i> Dashboard</a></li>
              <li><a href="/Consumptiondaily"><i className="fas fa-tint"></i> Consumo Diário</a></li>
              <li><a href="/Maintenance"><i className="fas fa-tools"></i> Manutenção</a></li>
              <li><a href="/SpecificMonitoring"><i className="fas fa-eye"></i> Monitoramento Específico</a></li>
              <li><a href="/Configuration"><i className="fa-solid fa-gear"></i> Configuração</a></li>
              <li><a href="#" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</a></li> {/* Alterado para chamar a função */}
            </ul>
          </nav>
        </div>
      </aside>
      <div className={`dashboard-main-content ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
        <DashboardHeaderNav handleMenuToggle={handleMenuToggle} />
        <UserProfile />
      </div>
    </div>
  );
}

export default UserHome;
