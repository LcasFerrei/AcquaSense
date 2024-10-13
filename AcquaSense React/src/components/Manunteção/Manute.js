import React, { useState, useEffect } from 'react';
import './Manute.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function Manute() {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [powerSavingMode, setPowerSavingMode] = useState(false);

  // Simulação do nível da bateria diminuindo
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prevLevel => {
        if (prevLevel > 0) {
          return prevLevel - (powerSavingMode ? 0.5 : 1); // Reduz mais devagar no modo de economia de energia
        }
        return 0;
      });
    }, 1000); // Diminui 1% da bateria a cada segundo
    return () => clearInterval(interval);
  }, [powerSavingMode]);

  // Vibração quando a bateria está abaixo de 20%
  useEffect(() => {
    if (batteryLevel <= 20 && batteryLevel > 0) {
      navigator.vibrate(1000); // Vibra por 1 segundo
    }
  }, [batteryLevel]);

  // Envio de logs de bateria via API
  const sendLogs = () => {
    axios.post('/api/send-logs', {
      logs: `Bateria atual: ${batteryLevel}%`
    })
    .then(response => alert('Logs enviados com sucesso!'))
    .catch(error => alert('Erro ao enviar logs.'));
  };

  // Gráfico de histórico de bateria
  const data = {
    labels: ['100%', '80%', '60%', '40%', '20%', '0%'],
    datasets: [
      {
        label: 'Histórico de Bateria',
        data: [100, 80, 60, 40, 20, 0],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const togglePowerSavingMode = () => {
    setPowerSavingMode(!powerSavingMode);
  };

  return (
    <div className="manute-container">
      <h1>Monitoramento de Bateria</h1>

      <div className="battery">
        <div
          className="battery-level"
          style={{ width: `${batteryLevel}%`, backgroundColor: batteryLevel > 20 ? 'green' : 'red' }}
        >
          {batteryLevel}%
        </div>
      </div>

      {batteryLevel === 0 && <p className="battery-message">Trocar Bateria / Pilha</p>}

      <button className="contact-button" onClick={() => alert('Entraremos em contato para agendar a visita técnica')}>
        Solicitar Visita Técnica
      </button>

      <section className="AcquaSoft-info">
        <h2>Sobre o AcquaSoft</h2>
        <p>
          Estamos utilizando o AcquaSoft, um microcontrolador versátil que oferece conectividade Wi-Fi e Bluetooth.
        </p>
        <div className="AcquaSoft-details">
          <h3>Detalhes do AcquaSoft</h3>
          <ul>
            <li>Temperatura: 35°C</li>
            <li>Status Wi-Fi: Conectado</li>
            <li>Voltagem da Bateria: 3.7V</li>
          </ul>
        </div>
      </section>

      <section className="battery-logs">
        <button className="send-logs-button" onClick={sendLogs}>
          Enviar Logs de Bateria
        </button>
      </section>

      <section className="battery-history">
        <h3>Histórico de Bateria</h3>
        <Line data={data} />
      </section>

      <button className="power-saving-button" onClick={togglePowerSavingMode}>
        {powerSavingMode ? 'Desativar Modo de Economia' : 'Ativar Modo de Economia'}
      </button>
    </div>
  );
}

export default Manute;
