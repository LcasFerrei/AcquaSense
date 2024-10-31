import React, { useState } from 'react';
import './Noti.css';

const notificationsData = [
  {
    id: 1,
    title: 'AcquaSoft Instalado com sucesso',
    time: '2 minutos atrás',
    details: 'O sistema AcquaSoft foi instalado e está pronto para uso.',
    unread: true,
  },
  {
    id: 2,
    title: 'Atualização do sistema disponível',
    time: '1 hora atrás',
    details: 'Uma nova atualização do sistema está disponível para download.',
    unread: true,
  },
  {
    id: 3,
    title: 'Seja Bem-Vindo ao AcquaSense',
    time: '3 horas atrás',
    details: 'Obrigado por se registrar no AcquaSense. Explore nossos recursos!',
    unread: false,
  }
];

const Noti = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [selectedNotification, setSelectedNotification] = useState(notificationsData[0]);
  const [filter, setFilter] = useState('all');

  // Função para marcar como lido
  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map((notification) =>
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };

  // Função para excluir notificação
  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
    if (selectedNotification.id === id) setSelectedNotification(null);
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
      {/* Cabeçalho das notificações */}
      <div className="notifications-header">
        <h2><i className="fas fa-bell"></i> Notificações</h2>
      </div>

      {/* Filtros de notificações */}
      <div className="notifications-filters">
        <button onClick={() => setFilter('all')}>Todas</button>
        <button onClick={() => setFilter('unread')}>Não lidas</button>
      </div>

      <div className="notifications-content">
        {/* Lista de notificações */}
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
                {/* Indicador de nova notificação */}
                {notification.unread && <span className="new-indicator"></span>}
              </div>
              <i className="fas fa-chevron-right"></i>
            </div>
          ))}
        </div>

        {/* Detalhes da notificação */}
        {selectedNotification && (
          <div className="notification-details">
            <div className="details-header">
              <h3>{selectedNotification.title}</h3>
              <span className="notification-time-details">{selectedNotification.time}</span>
            </div>
            <p>{selectedNotification.details}</p>
            <div className="notification-actions">
              {/* Botões de ações */}
              <button onClick={() => handleMarkAsRead(selectedNotification.id)}>Marcar como lido</button>
              <button onClick={() => handleDeleteNotification(selectedNotification.id)}>Excluir</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Noti;
