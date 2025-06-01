import React, { useEffect, useState } from 'react';
import { BarChart, Bar, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import './Dash.css';

const Dash = () => {
  const [dashboardData, setDashboardData] = useState({
    news: "",
    daily_consumption: 0,
    pipes_status: "",
    daily_goal: "",
    accumulated_consumption: "",
    consumptionByPoint: [] // Novo estado para o consumo por ponto
  });

  useEffect(() => {
    const socket = new WebSocket('ws://acquasense.onrender.com/ws/Dashboard/');
  
    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      const { daily_consumption, accumulated_consumption } = data;
      console.log(data); // Para verificar os dados recebidos
      setDashboardData(prevData => ({
        ...prevData,
        ...data,
        daily_consumption: parseFloat(daily_consumption || 0),
        consumptionByPoint: Object.entries(data.accumulated_consumption || {}).map(
          ([key, value]) => ({
            name: key, // Nome do ponto de uso
            consumption: value.consumo, // Valor do consumo
            percentage: value.porcentagem // Porcentagem do consumo
          })
        )
      }));
    };
  
    return () => socket.close();
  }, []);

  return (
    <section className="dashboard">
      <h2><i className="fas fa-chart-bar"></i> Dashboard</h2>
      <div id="cards-container" className="cards">
        <div className="card">
          <h3>Novidades</h3>
          <p>{dashboardData.news}</p>
          <a href="https://acquasense-jypoxjb.gamma.site/" target="_blank" rel="noopener noreferrer">
            <button>Veja mais</button>
          </a>
        </div>
        <a className='card-href' href='/Consumptiondaily'>
          <div className="card">
            <h3>Consumo do dia</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: "Consumo Diário", consumption: dashboardData.daily_consumption }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis label={{ value: 'Consumo (Litros)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="consumption" fill="#bb86fc" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </a>
        <a className='card-href' href='/SpecificMonitoring'>
        <div className="card">
          <h3>Consumo por Ponto do dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.consumptionByPoint}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Pontos (Litros)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value, name) => (name === 'percentage' ? `${value}%` : `${value} Litros`)} />
              <Bar dataKey="consumption" fill="#6c63ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        </a>
      </div>
    </section>
  );
};

export default Dash;
