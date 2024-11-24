import React, { useState, useEffect } from 'react';
import './Noti.css';

const Noti = () => {

  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filter, setFilter] = useState('all');

  // Função para buscar notificações da API Django
  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('http://localhost:8000/alerts/notificacoes/', {
        method: "GET",
        credentials: "include", // Envia cookies de autenticação
      });
      const data = await response.json();
      setNotifications(data.notificacoes);
      console.log(data.notificacoes)
      if (data.notificacoes.length > 0) {
        setSelectedNotification(data.notificacoes[0]);
      }
    };
    fetchNotifications();
  }, []);

  function getCsrfToken() {
    const name = 'csrftoken';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Função para marcar como lido
  const handleMarkAsRead = async (id) => {
    const csrfToken = getCsrfToken(); // Obtém o token CSRF

    try {
      const response = await fetch(`http://localhost:8000/alerts/notificacao/marcar_como_lida/${id}/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,  // Adiciona o CSRF token no cabeçalho
        },
        credentials: "include",  // Envia cookies de autenticação
      });

      const data = await response.json();

      if (data.status === 'success') {
        setNotifications(notifications.map((notification) =>
          notification.id === id ? { ...notification, unread: false } : notification
        ));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
      alert('Erro ao marcar a notificação como lida.');
    }
  };

  // Função para filtrar notificações
  const filteredNotifications = notifications.filter((notification) =>
    filter === 'all' ? true : notification.unread
  );

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2><i className="fas fa-bell"></i> Notificações</h2>
      </div>
      <div className="notifications-filters">
        <button onClick={() => setFilter('all')}>Todas</button>
        <button onClick={() => setFilter('unread')}>Não lidas</button>
      </div>

      <div className="notifications-content">
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${notification.id === selectedNotification?.id ? 'active' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-info">
                <h4>{notification.title}</h4>
                <span className="notification-time">{notification.time}</span>
                {notification.unread && <span className="new-indicator"></span>}
              </div>
              <i className="fas fa-chevron-right"></i>
            </div>
          ))}
        </div>

        {selectedNotification && (
          <div className="notification-details">
            <div className="details-header">
              <h3>{selectedNotification.title}</h3>
              <span className="notification-time-details">{selectedNotification.time}</span>
            </div>
            <p>{selectedNotification.details}</p>
            <div className="notification-actions">
              <button onClick={() => handleMarkAsRead(selectedNotification.id)}>Marcar como lido</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Noti;
