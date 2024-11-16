import React, { useEffect, useState } from 'react';
import './Dash.css';

const Dash = () => {
  const [dashboardData, setDashboardData] = useState({
    news: "",
    daily_consumption: "",
    pipes_status: "",
    daily_goal: "",
    accumulated_consumption: ""
  });

  useEffect(() => {
    // Estabelecer conexão WebSocket
    const socket = new WebSocket('ws://localhost:8000/ws/Dashboard/');

    // Definir comportamento ao receber mensagens do WebSocket
    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      setDashboardData(prevData => ({
        ...prevData,
        ...data // Atualiza apenas as propriedades necessárias
      }));
      console.log(data);
    };

    // Limpar a conexão ao desmontar o componente
    return () => socket.close();
  }, []);

  return (
    <section className="dashboard">
      <h2><i className="fas fa-chart-line"></i> Dashboard</h2>
      <div id="cards-container" className="cards">  
        <div className="card">
          <h3>Novidades</h3>
          <p>{dashboardData.news}</p>
          <a href="https://acquasense-jypoxjb.gamma.site/" target="_blank"><button>Veja mais</button></a>
        </div>
        <div className="card">
          <h3>Consumo do dia</h3>
          <p>{dashboardData.daily_consumption}</p>
          <div className="chart">
            <svg></svg>
          </div>
        </div>
        <div className="card">
          <h3>Meta diária</h3>
          <p>{dashboardData.daily_goal}</p>
          <div className="chart">
            <svg></svg>
          </div>
        </div>
        <div className="card">
          <h3>Consumo acumulado</h3>
          <p>{dashboardData.accumulated_consumption}</p>
          <div className="chart">
            <svg></svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dash;

// Componente que alimenta (miolo) a tela DashHome = Dashboard
