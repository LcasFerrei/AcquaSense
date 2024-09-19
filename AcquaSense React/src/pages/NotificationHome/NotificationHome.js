import React from 'react';
import Noti from '../../components/Notification/Notification';
import HeaderNav from "../../components/AcquaNav/Header";
import './NotiHome.css';

function NotificationHome() {
    return (
        <div className="notification-home">
            {/* Sidebar e Header */}
            <div className="sidebar">
                <HeaderNav />
            </div>
            
            {/* Conteúdo principal */}
            <div className="main-content">
                <div className="noti-container">
                    <Noti />
                </div>
            </div>
        </div>
    );
}

export default NotificationHome;