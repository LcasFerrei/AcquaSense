import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import HeaderNav from "../../components/AcquaNav/Header";
import '../../components/User/User.css';
import ConfiguSettings from "../../components/Configuracoes/ConfiguSettings";

function ConsumoHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica a autenticação do usuário ao carregar o componente
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8000/check-auth/", {
          method: "GET",
          credentials: "include", // Envia cookies de autenticação
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);
          console.log(data)
        } else {
          setIsAuthenticated(false); // Se a resposta não for ok, assume que não está autenticado
          navigate('/login'); // Redireciona para a página de login
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    checkAuth(); // Chama a função para verificar a autenticação

  }, [navigate]);

  if (isAuthenticated !== true) {
    return <div></div>;
  }

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Aqui você deve incluir a lógica de logout, como limpar tokens ou informações de sessão
    console.log("Usuário deslogado");
    // Redirecionar para a raiz da página
    window.location.href = '/login';
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="dashboard-logo-menu">
          <div className="dashboard-logo">
            <a href="/Dashboard" className="dashboard-logo-link">
              <h2>AcquaSense</h2>
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
            <li><a onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><span> Logout</span></a></li>
          </ul>
        </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
        <HeaderNav handleMenuToggle={handleMenuToggle} />
        <ConfiguSettings />
      </div>
    </div>
  );
}

export default ConsumoHome;