import React, { useState } from 'react';
import './Configu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

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

const ConfiguSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    console.log('Alterações salvas');
    setIsSaved(true);
    setIsEditing(false);
    setTimeout(() => setIsSaved(false), 3000); // Mensagem de salvamento temporário
  };

  return (
    <div className="config-container">
      <div className="settings-header">
        <h2>Configuração</h2>
        <FontAwesomeIcon icon={faCog} size="lg" className="icon" />
      </div>
      <NotificationSettings />
      <DataAnalysisSettings />
      <div className="button-container">
        <div className="edit-button-container">
          <button className="edit-button" onClick={handleSave}>
            Salvar
          </button>
          {isEditing && (
            <button className="edit-button" onClick={() => setIsEditing(false)}>Cancelar</button>
          )}
        </div>
      </div>
      {isSaved && <div className="save-notification">Alterações salvas com sucesso!</div>}
    </div>
  );
};

export default ConfiguSettings;
