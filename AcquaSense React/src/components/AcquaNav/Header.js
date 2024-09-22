import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ThemeContext } from '../ThemeContext'; // Importa o contexto de tema
import './Header.css'; 

const HeaderNav = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate(); 
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Usa o contexto de tema

  const handleMenuToggle = () => {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const mainContent = document.querySelector('.dashboard-main-content');
    sidebar.classList.toggle('hidden');
    mainContent.classList.toggle('expanded');
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const query = event.target.value.trim().toLowerCase();
      handleSearchQuery(query);
    }
  };

  const handleSearchQuery = (query) => {
    const pages = {
      'dashboard': '/dashboard',
      'consumo diário': '/consumption-daily',
      'manutenção': '/maintenance',
      'monitoramento específico': '/specific-monitoring',
      'vazamento': '/water-leak',
      'conta de água': '/water-bill',
      'novidades': '/news',
      'tubulações': '/pipes',
      'meta diária': '/daily-goal',
      'consumo acumulado': '/accumulated-consumption'
    };

    if (pages[query]) {
      navigate(pages[query]);
    } else {
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        card.style.display = cardText.includes(query) ? 'block' : 'none';
      });
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setIsNotificationOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dashboard-header-nav">
      <aside className="dashboard-sidebar">
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
              <li><a href="/Configuration"><i class="fa-solid fa-gear"></i> Configuração</a></li>
              <li><a href="/login"><i className="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="dashboard-main-content">
        <header className="dashboard-header">
          <div className="dashboard-search-bar">
            <i id="menu-toggle" className="fas fa-bars" onClick={handleMenuToggle}></i>
            <input
              type="text"
              id="search-input"
              placeholder="Pesquisar"
              onKeyPress={handleSearch}
            />
          </div>
          <div className="dashboard-user-info">
            <div
              className="dashboard-notification-container"
              ref={notificationRef}
            >
              <i
                className="fas fa-bell"
                id="notification-icon"
                onClick={handleNotificationClick}
              ></i>
              {isNotificationOpen && (
                <div
                  className="dashboard-notification-dropdown"
                  id="dashboard-notification-dropdown"
                >
                 <h3><a href="/Notification">Notificações</a></h3>
                  <ul>
                    <li>
                      AcquaSoft Instalando com Sucesso
                      <span className="notification-time">2 minutos atrás</span>
                    </li> 
                    <li>
                      Atualização do sistema disponível
                      <span className="notification-time">1 hora atrás</span>
                    </li>
                    <li>
                      Seja Bem Vindo AcquaSense
                      <span className="notification-time">3 horas atrás</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <p>Bem-vindo de volta, <strong>Usuário</strong></p>
            <button id="theme-toggle" onClick={toggleTheme}>
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i> 
              {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            </button>
          </div>
        </header>
      </main>
    </div>
  );
};

export default HeaderNav;
