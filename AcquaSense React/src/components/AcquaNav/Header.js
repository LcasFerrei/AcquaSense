import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import './Header.css';

const HeaderNav = ({ handleMenuToggle }) => {
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  // Mapeamento das páginas
  const pages = {
    'Alerta de Consumo': '/Configuration',
    'Comunicação com o usuário': '/Configuration',
    'Configurações de análise de dados': '/Configuration',
    'Consumo Acumulado por hora': '/Consumptiondaily',
    'Consumo Acumulado': '/dashboard',
    'Consumo diário': '/consumptiondaily',
    'Consumo diário em litros em uma residência': '/specificMonitoring',
    'Consumo diário por compartimentos': '/specificMonitoring',
    'Consumo do dia': '/dashboard',
    'Consumo mensal em litros': '/specificMonitoring',
    'Consumo por Pontos de Uso': '/SpecificMonitoring',
    'Dashboard': '/dashboard',
    'Detalhes da assinatura': '/userPage',
    'Horário de Notificação': '/Configuration',
    'Informações pessoais': '/userPage',
    'Intervalo de Dados': '/Configuration',
    'Login': '/login',
    'Manutenção': '/maintenance',
    'Meta diária': '/dashboard',
    'Monitoramento específico': '/specificMonitoring',
    'Notificação': '/notification',
    'Novidades': '/news',
    'Progresso de Consumo de Água': '/Consumptiondaily',
    'Relatórios de Consumo': '/Configuration',
    'Perfil': '/userPage',
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:8000/alerts/notificacao/nao_lidas_notificacoes/', {
          method: "GET",
          credentials: "include", // Envia cookies de autenticação
        });
        if (!response.ok) throw new Error('Erro ao buscar notificações');
        const data = await response.json();
        setNotifications(data.notificacoes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/username/', {
          method: "GET",
          credentials: "include", // Envia cookies de autenticação
        });
        if (!response.ok) throw new Error('Erro ao buscar o nome de usuário');
        
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await fetch('http://localhost:8000/alerts/notificacao/unread-notifications/', {
          method: 'GET',
          credentials: 'include', // Para garantir que os cookies sejam enviados com a requisição
        });
        if (!response.ok) throw new Error('Erro ao buscar notificações não lidas');
        
        const data = await response.json();
        setUnreadCount(data.unread_count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUnreadNotifications();
  }, []);

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
    setNoResults(filteredSuggestions.length === 0);
  };

  const navigateToQuery = (query) => {
    const suggestion = suggestions.find(sug => sug.toLowerCase() === query.toLowerCase());
    if (suggestion) {
      navigate(pages[suggestion]);
    }
  };

  const handleNotificationClick = (event) => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    // Verifica se o clique foi fora do dropdown de notificação
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
    document.addEventListener('click', handleClickOutside); 
    document.addEventListener('click', handleClickOutsideSearch);

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      document.removeEventListener('click', handleClickOutside); 
      document.removeEventListener('click', handleClickOutsideSearch);
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
              autoFocus
            />
            {suggestions.length > 0 ? (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => navigateToQuery(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            ) : noResults ? (
              <div className="no-results-message">Sem sugestões de pesquisa</div>
            ) : null}
          </div>
        )}
        <div className="dashboard-user-info">
        <p>Bem-vindo de volta, <strong>{username}</strong></p>
          {!isMobileView && (
            <>
              <div className="dashboard-notification-container">
              <div>
                <i className="fas fa-bell" 
                id="notification-icon" onClick={handleNotificationClick}>
                </i>
                {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
              </div>
              {isNotificationOpen && (
                <div className="dashboard-notification-dropdown" id="dashboard-notification-dropdown">
                  <h3><a href="/Notification">Notificações</a></h3>
                  <ul>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <li onClick={() => navigate(`/notification/`)}>
                          <span className="notification-title"><strong className='title-notification'>{notification.title}</strong></span>
                          <span className="notification-time">{notification.time}</span>
                        </li>
                      ))
                    ) : (
                      <li onClick={() => navigate(`/notification/`)}>Sem novas notificações</li>
                    )}
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
