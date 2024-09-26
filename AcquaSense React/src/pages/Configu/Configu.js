import React, { useState } from 'react';
import HeaderNav from "../../components/AcquaNav/Header";
import '../../components/User/User.css';
import './Configu.css'; // Importando o CSS da nova pasta

// Componente para Configurações de Notificações
const NotificationSettings = () => (
  <div className="notification-settings">
    <h2>Comunicação com o Usuário</h2>
    <div>
      <label>
        <input type="checkbox" name="emailNotification" />
        Notificar por E-mail
      </label>
      <label>
        <input type="checkbox" name="appNotification" />
        Notificar por Aplicativo
      </label>
    </div>
    <div>
      <h3>Alertas de Consumo</h3>
      <label>
        <input type="checkbox" name="highConsumptionAlert" />
        Alertas de Alto Consumo
      </label>
      <label>
        <input type="checkbox" name="anomalousConsumptionAlert" />
        Alertas de Consumo Anômalo
      </label>
    </div>
    <div>
      <h3>Horário de Notificação</h3>
      <label>
        Horário de Notificação:
        <input type="time" name="notificationTime" />
      </label>
    </div>
  </div>
);

// Componente para Configurações de Análise de Dados
const DataAnalysisSettings = () => (
  <div className="data-analysis-settings">
    <h2>Configurações de Análise de Dados</h2>
    <div>
      <h3>Relatórios de Consumo</h3>
      <label>
        Frequência dos Relatórios:
        <select name="reportFrequency">
          <option value="daily">Diariamente</option>
          <option value="weekly">Semanalmente</option>
          <option value="monthly">Mensalmente</option>
        </select>
      </label>
      <label>
        Formato dos Relatórios:
        <select name="reportFormat">
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
        </select>
      </label>
    </div>
    <div>
      <h3>Intervalos de Dados</h3>
      <label>
        Intervalos de Dados:
        <select name="dataIntervals">
          <option value="7days">Últimos 7 dias</option>
          <option value="30days">Últimos 30 dias</option>
        </select>
      </label>
    </div>
  </div>
);

function ConfiguHome() {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log('Alterações salvas');
    setIsEditing(false);
  };

  return (
    <div>
      <HeaderNav />
      <div className="config-container">
        <NotificationSettings />
        <DataAnalysisSettings />
      </div>
      <div className="edit-button-container">
        <button className="edit-button" onClick={handleSave}>
          Salvar
        </button>
        {isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(false)}>Cancelar</button>
        )}
      </div>
    </div>
  );
}

export default ConfiguHome;


