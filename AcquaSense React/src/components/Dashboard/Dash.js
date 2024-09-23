import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
    axios.get('http://localhost:8000/dashboard/')
      .then(response => {
        setDashboardData(response.data);
      })
      .catch(error => {
        console.error("Error fetching dashboard data:", error);
      });
  }, []);

  return (
    <section className="dashboard">
      <h2><i className="fas fa-chart-line"></i> Dashboard</h2>
      <div id="cards-container" className="cards">
        <div className="card news">
          <h3>Novidades</h3>
          <p>{dashboardData.news}</p>
          <button>Veja mais</button>
        </div>
        <div className="card">
          <h3>Consumo do dia</h3>
          <p>{dashboardData.daily_consumption}</p>
          <div className="chart">
            <svg></svg>
          </div>
        </div>
        <div className="card">
          <h3>Tubulações</h3>
          <p>{dashboardData.pipes_status}</p>
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
