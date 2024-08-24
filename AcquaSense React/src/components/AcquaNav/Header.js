import React from 'react';
import './Header.css'; // CSS específico para o dashboard

const DashboardHeaderNav = () => {
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
      'dashboard': '/index.html',
      'consumo diário': '/Consumptiondaily.html',
      'manutenção': '/Maintenance.html',
      'monitoramento específico': '/SpecificMonitoring.html',
      'vazamento': '#',
      'conta de água': '#',
      'novidades': '#',
      'tubulações': '#',
      'meta diária': '#',
      'consumo acumulado': '#'
    };

    if (pages[query]) {
      window.location.href = pages[query];
    } else {
      const cards = document.querySelectorAll('.dashboard-card');
      cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        card.style.display = cardText.includes(query) ? 'block' : 'none';
      });
    }
  };

  const handleNotificationClick = () => {
    const dropdown = document.getElementById('dashboard-notification-dropdown');
    dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
  };

  const handleThemeToggle = () => {
    document.body.classList.toggle('dark-mode');
    const themeToggleButton = document.getElementById('dashboard-theme-toggle');
    const icon = themeToggleButton.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      themeToggleButton.textContent = ' Modo Claro';
      themeToggleButton.prepend(icon);
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      themeToggleButton.textContent = ' Modo Escuro';
      themeToggleButton.prepend(icon);
    }
  };

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
              <li><a href="/index.html"><i className="fas fa-chart-line"></i> Dashboard</a></li>
              <li><a href="/Consumptiondaily.html"><i className="fas fa-tint"></i> Consumo Diário</a></li>
              <li><a href="/Maintenance.html"><i className="fas fa-tools"></i> Manutenção</a></li>
              <li><a href="/SpecificMonitoring.html"><i className="fas fa-eye"></i> Monitoramento Específico</a></li>
              <li><a href="#"><i className="fas fa-water"></i> Vazamento</a></li>
              <li><a href="#"><i className="fas fa-file-invoice-dollar"></i> Conta de água</a></li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="dashboard-main-content">
        <header className="dashboard-header">
          <div className="dashboard-search-bar">
            <i id="dashboard-menu-toggle" className="fas fa-bars" onClick={handleMenuToggle}></i>
            <input type="text" id="dashboard-search-input" placeholder="Pesquisar" onKeyPress={handleSearch} />
          </div>
          <div className="dashboard-user-info">
            <div className="dashboard-notification-container">
              <i className="fas fa-bell" id="dashboard-notification-icon" onClick={handleNotificationClick}></i>
              <div className="dashboard-notification-dropdown" id="dashboard-notification-dropdown">
                <h3>Notificações</h3>
                <ul>
                  <li>Nenhuma nova notificação</li>
                </ul>
              </div>
            </div>
            <p>Bem-vindo de volta, <strong>Usuário</strong></p>
            <button id="dashboard-theme-toggle" onClick={handleThemeToggle}><i className="fa-solid fa-moon"></i> Modo Escuro</button>
          </div>
        </header>
      </main>
    </div>
  );
};

export default DashboardHeaderNav;
