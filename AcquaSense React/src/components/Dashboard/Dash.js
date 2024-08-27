// Dashboard.js
import React from 'react';
import './Dash.css'; // Certifique-se de criar este arquivo com o CSS fornecido

const Dash = () => {
  return (
    <section className="dashboard">
      <h2><i className="fas fa-chart-line"></i> Dashboard</h2>
      <div id="cards-container" className="cards">
        <div className="card news">
          <h3>Novidades</h3>
          <p>Após a criação do AcquaSense, tivemos uma redução em média de 20% no consumo de água nas condomínios que faturamos.</p>
          <button>Veja mais</button>
        </div>
        <div className="card">
          <h3>Consumo do dia</h3>
          <p>108 Litros</p>
          <div className="chart">
            <svg></svg>
          </div>
        </div>
        <div className="card">
          <h3>Tubulações</h3>
          <p>Normal</p>
          <div className="chart">
            <svg></svg>
          </div>
        </div>
        <div className="card">
          <h3>Meta diária</h3>
          <p>120 Litros</p>
          <div className="chart">
            <svg></svg>
          </div>
        </div>
        <div className="card">
          <h3>Consumo acumulado</h3>
          <div className="chart">
            <svg></svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dash;
