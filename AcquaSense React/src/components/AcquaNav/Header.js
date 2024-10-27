import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ThemeContext } from '../ThemeContext';
import './Header.css'; 

const HeaderNav = ({ handleMenuToggle }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate(); 
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); 

  const pages = {
    'Alerta de Consumo': '/specificMonitoring',
    'Comunicação com o usuário': '/Configuration',
    'Configurações de análise de dados': '/Configuration',
    'Consumo acumulado': '/dashboard',
    'Consumo diário': '/consumptiondaily',
    'Consumo diário em litros em uma residência': '/specificMonitoring',
    'Consumo diário por compartimentos': '/specificMonitoring',
    'Consumo do dia': '/dashboard',
    'Consumo mensal em litros': '/specificMonitoring',
    'Dashboard': '/dashboard',
    'Detalhes da assinatura': '/userPage',
    'Informações pessoais': '/userPage',
    'Login': '/login',
    'Manutenção': '/maintenance',
    'Meta diária': '/dashboard',
    'Monitoramento específico': '/specificMonitoring',
    'Notificação': '/notification',
    'Novidades': '/news',
    'Tubulações': '/pipes',
    'Vazamento': '/water-leak',
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    updateSuggestions(value);

    if (event.key === 'Enter') {
      event.preventDefault();
      navigateToQuery(value.trim().toLowerCase());
    }
  };

  const updateSuggestions = (query) => {
    const filteredSuggestions = Object.keys(pages).filter(page => 
      page.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const navigateToQuery = (query) => {
    if (pages[query]) {
      navigate(pages[query]);
    }
  };

  const handleNotificationClick = (event) => {
    event.stopPropagation();
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleClickOutsideNotification = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setIsNotificationOpen(false);
    }
  };

  const handleClickOutsideSearch = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideNotification);
    document.addEventListener('mousedown', handleClickOutsideSearch);
    
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotification);
      document.removeEventListener('mousedown', handleClickOutsideSearch);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-nav">
        {!isMobileView && (
          <div className="dashboard-search-bar" ref={searchRef}>
            <i id="menu-toggle" className="fas fa-bars" onClick={handleMenuToggle}></i>
            <input
              type="text"
              id="search-input"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleSearch}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => navigateToQuery(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="dashboard-user-info">
          <p>Bem-vindo de volta, <strong>Usuário</strong></p>
          {!isMobileView && (
            <>
              <div className="dashboard-notification-container" ref={notificationRef}>
                <i
                  className="fas fa-bell"
                  id="notification-icon"
                  onClick={handleNotificationClick}
                ></i>
                {isNotificationOpen && (
                  <div className="dashboard-notification-dropdown" id="dashboard-notification-dropdown">
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
              <button id="theme-toggle" onClick={toggleTheme}>
                <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i> 
                {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;
