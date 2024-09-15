import React from 'react';
import Noti from '../../components/Notification/Notification';
import HeaderNav from "../../components/AcquaNav/Header";

function NotificationHome() {
    return (
        <div className="notification-home">
            <HeaderNav />
            <div className="main-content">
                <div className="sidebar">
                    {/* Coloque aqui os itens da sidebar se não estiverem no Header */}
                </div>
                <div className="noti-container">
                    <Noti />
                </div>
            </div>
        </div>
    );
}

export default NotificationHome;
