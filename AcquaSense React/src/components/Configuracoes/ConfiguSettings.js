import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import './Configu.css';

const NotificationSettings = ({ settings, setSettings }) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  return (
    <div className="notification-settings">
      <h2>Comunicação com o Usuário</h2>
      <div>
        <label>
          <input
            type="checkbox"
            name="emailNotification"
            checked={settings.emailNotification}
            onChange={handleCheckboxChange}
          />
          Notificar por E-mail
        </label>
        <label>
          <input
            type="checkbox"
            name="appNotification"
            checked={settings.appNotification}
            onChange={handleCheckboxChange}
          />
          Notificar por Aplicativo
        </label>
      </div>
      <div>
        <h3>Alertas de Consumo</h3>
        <label>
          <input
            type="checkbox"
            name="highConsumptionAlert"
            checked={settings.highConsumptionAlert}
            onChange={handleCheckboxChange}
          />
          Alertas de Alto Consumo
        </label>
        <label>
          <input
            type="checkbox"
            name="anomalousConsumptionAlert"
            checked={settings.anomalousConsumptionAlert}
            onChange={handleCheckboxChange}
          />
          Alertas de Consumo Anômalo
        </label>
      </div>
      <div>
        <h3>Horário de Notificação</h3>
        <label>
          Horário de Notificação:
          <input
            type="time"
            name="notificationTime"
            value={settings.notificationTime || ""}
            onChange={handleTimeChange}
          />
        </label>
      </div>
    </div>
  );
};

const DataAnalysisSettings = ({ settings, setSettings }) => {
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  return (
    <div className="data-analysis-settings">
      <h2>Configurações de Análise de Dados</h2>
      <div>
        <h3>Relatórios de Consumo</h3>
        <label>
          Frequência dos Relatórios:
          <select
            name="reportFrequency"
            value={settings.reportFrequency}
            onChange={handleSelectChange}
          >
            <option value="daily">Diariamente</option>
            <option value="weekly">Semanalmente</option>
            <option value="monthly">Mensalmente</option>
          </select>
        </label>
        <label>
          Formato dos Relatórios:
          <select
            name="reportFormat"
            value={settings.reportFormat}
            onChange={handleSelectChange}
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        </label>
      </div>
      <div>
        <h3>Intervalos de Dados</h3>
        <label>
          Intervalos de Dados:
          <select
            name="dataIntervals"
            value={settings.dataIntervals}
            onChange={handleSelectChange}
          >
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
          </select>
        </label>
      </div>
    </div>
  );
};

const ConfiguSettings = () => {
  const [settings, setSettings] = useState({
    emailNotification: false,
    appNotification: false,
    highConsumptionAlert: false,
    anomalousConsumptionAlert: false,
    notificationTime: '', // Inicializando com valor vazio
    reportFrequency: 'daily', // Inicializando com valor padrão
    reportFormat: 'pdf', // Inicializando com valor padrão
    dataIntervals: '7days', // Inicializando com valor padrão
  });
  const [isSaved, setIsSaved] = useState(false);

  // Carrega as configurações salvas do localStorage ao montar o componente
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('notificationSettings'));
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleSave = () => {
    // Salva as configurações no localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); // Mensagem de salvamento temporário
  };

  return (
    <div className="config-container">
      <div className="settings-header">
        <FontAwesomeIcon icon={faCog} size="lg" className="icon" />
        <h2>Configuração</h2>
      </div>
      <NotificationSettings settings={settings} setSettings={setSettings} />
      <DataAnalysisSettings settings={settings} setSettings={setSettings} />
      <div className="button-container">
        <div className="edit-button-container">
          <button className="edit-button" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
      {isSaved && <div className="save-notification">Alterações salvas com sucesso!</div>}
    </div>
  );
};

export default ConfiguSettings;
