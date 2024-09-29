import React, { useState } from 'react';
import './Noti.css';

const notificationsData = [
  {
    id: 1,
    title: 'AcquaSoft Instalado com sucesso',
    time: '2 minutos atrás',
    details: 'O sistema AcquaSoft foi instalado e está pronto para uso.',
  },
  {
    id: 2,
    title: 'Atualização do sistema disponível',
    time: '1 hora atrás',
    details: 'Uma nova atualização do sistema está disponível para download.',
  },
  {
    id: 3,
    title: 'Seja Bem-Vindo ao AcquaSense',
    time: '3 horas atrás',
    details: 'Obrigado por se registrar no AcquaSense. Explore nossos recursos!',
  }
];

const Noti = () => {
  const [selectedNotification, setSelectedNotification] = useState(notificationsData[0]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  return (
    <div className="notifications-container">
      {/* Cabeçalho das notificações */}
      <div className="notifications-header">
        <h2><i className="fas fa-bell"></i> Notificações</h2>
      </div>

      <div className="notifications-content">
        {/* Lista de notificações */}
        <div className="notifications-list">
          {notificationsData.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.id === selectedNotification.id ? 'active' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-info">
                <h4>{notification.title}</h4>
                <span className="notification-time">{notification.time}</span>
              </div>
              <i className="fas fa-chevron-right"></i>
            </div>
          ))}
        </div>

        {/* Detalhes da notificação */}
        <div className="notification-details">
          <div className="details-header">
            <h3>{selectedNotification.title}</h3>
            <span className="notification-time-details">{selectedNotification.time}</span>
          </div>
          <p>{selectedNotification.details}</p>
        </div>
      </div>
    </div>
  );
};

export default Noti;
