import React, { useState } from 'react';
import './Noti.css'; // Certifique-se de ajustar o CSS conforme necessário

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
      {/* Título de notificações com ícone */}
      <h2><i className="fas fa-bell"></i> Notificações</h2>

      <div className="notifications-list">
        {notificationsData.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${notification.id === selectedNotification.id ? 'active' : ''}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <h4>{notification.title}</h4>
            <span className="notification-time">{notification.time}</span>
          </div>
        ))}
      </div>
      <div className="notification-details">
        <h3>{selectedNotification.title}</h3>
        <span className="notification-time-details">{selectedNotification.time}</span>
        <p>{selectedNotification.details}</p>
      </div>
    </div>
  );
};

export default Noti;

