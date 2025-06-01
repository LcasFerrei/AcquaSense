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
    // ... outros mapeamentos omitidos por brevidade
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('https://acquasense.onrender.com/alerts/notificacao/nao_lidas_notificacoes/', {
          method: "GET",
          credentials: "include",
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
        const response = await fetch('https://acquasense.onrender.com/api/username/', {
          method: "GET",
          credentials: "include",
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
        const response = await fetch('https://acquasense.onrender.com/alerts/notificacao/unread-notifications/', {
          method: 'GET',
          credentials: 'include',
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

  const handleNotificationClick = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setIsNotificationOpen(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Substituir click por mousedown

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Substituir click por mousedown
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
      <div className="dashboard-notification-container" ref={notificationRef}>
        <div className="notification-icon-container">
          <i className="fas fa-bell" id="notification-icon" onClick={handleNotificationClick}></i>
          {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
        </div>
        {isNotificationOpen && (
          <div className="dashboard-notification-dropdown" id="dashboard-notification-dropdown">
            <h3><a href="/Notification">Notificações</a></h3>
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li key={index} onClick={() => navigate(`/notification/`)}>
                    <span className="notification-title">
                      <strong className='title-notification'>{notification.title}</strong>
                    </span>
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
      <button id="theme-toggle" onClick={(event) => { event.stopPropagation(); toggleTheme(); }}>
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
