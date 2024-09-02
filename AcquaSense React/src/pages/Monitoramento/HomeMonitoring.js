import React from 'react';
import HeaderNav from "../../components/AcquaNav/Header";
import MonitoramentoAgua from "../../components/Monitoramento/Monitoramento";
import './HomeMonitoring.css';

function MonitoringHome() {
    return (
        <div className="monitoramento-container">
            <div className="monitoring-header">
                <HeaderNav /> {/* Header com classe específica */}
            </div>
            <MonitoramentoAgua />
        </div>
    );
}

export default MonitoringHome;
