import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import './User.css';

const dailyConsumptionData = [
  { day: 'Seg', litros: 100 },
  { day: 'Ter', litros: 120 },
  { day: 'Qua', litros: 80 },
  { day: 'Qui', litros: 90 },
  { day: 'Sex', litros: 130 },
  { day: 'Sáb', litros: 110 },
  { day: 'Dom', litros: 95 },
];

const compartmentConsumptionData = [
  { day: 'Seg', banheiro: 40, lavanderia: 30, cozinha: 30 },
  { day: 'Ter', banheiro: 50, lavanderia: 40, cozinha: 30 },
  { day: 'Qua', banheiro: 30, lavanderia: 20, cozinha: 30 },
  { day: 'Qui', banheiro: 35, lavanderia: 25, cozinha: 30 },
  { day: 'Sex', banheiro: 55, lavanderia: 35, cozinha: 40 },
  { day: 'Sáb', banheiro: 45, lavanderia: 35, cozinha: 30 },
  { day: 'Dom', banheiro: 40, lavanderia: 30, cozinha: 25 },
];

const monthlyConsumptionData = [
  { week: 'Semana 1', litros: 400 },
  { week: 'Semana 2', litros: 350 },
  { week: 'Semana 3', litros: 450 },
  { week: 'Semana 4', litros: 500 },
];

const UserProfile = () => {
  const totalConsumption = 850; // Consumo total fictício em litros
  const consumptionLimit = 1000; // Limite de consumo fictício em litros
  const remainingConsumption = consumptionLimit - totalConsumption;
  const averageDailyConsumption = (totalConsumption / 30).toFixed(2);
  const monthlyEstimate = ((totalConsumption / 30) * 30).toFixed(2);

  return (
    <div className="user-home-container">
      <div class="user-column">
  <h2>Dados do Usuário</h2>
  <div class="user-info">
    <p><strong>Nome:</strong> João da Silva</p>
    <p><strong>IP do Cliente:</strong> 192.168.1.1</p>
    <p><strong>Endereço:</strong> Rua das Flores, 123, Fortaleza - CE</p>
    <p><strong>Quantidade de Sensores Instalados:</strong> 3</p>
    <p><strong>IP dos Sensores:</strong></p>
    <ul>
      <li>192.168.1.101</li>
      <li>192.168.1.102</li>
      <li>192.168.1.103</li>
    </ul>
    <p><strong>Último Acesso:</strong> 26/08/2024 14:35</p>
    <p><strong>Status da Conta:</strong> Ativa</p>
    <p><strong>Número de Alertas:</strong> 2</p>
    <p><strong>Histórico de Atividades:</strong></p>
    <ul>
      <li>Configuração de novos sensores - 25/08/2024</li>
      <li>Alteração de senha - 20/08/2024</li>
    </ul>
  </div>
</div>
      
      <div className="user-graphs-container">
        <div className="user-graphs">
          <div className="graph">
            <h3>Consumo Diário em Litros da Residência</h3>
            <LineChart width={400} height={220} data={dailyConsumptionData}>
              <Line type="monotone" dataKey="litros" stroke="#3f51b5" strokeWidth={3} />
              <CartesianGrid stroke="#e0e0e0" />
              <XAxis dataKey="day" />
              <YAxis unit="L" />
              <Tooltip formatter={(value) => `${value} Litros`} />
              <Legend />
            </LineChart>
          </div>

          <div className="graph">
            <h3>Consumo Diário por Compartimentos</h3>
            <BarChart width={400} height={220} data={compartmentConsumptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis unit="L" />
              <Tooltip formatter={(value) => `${value} Litros`} />
              <Legend />
              <Bar dataKey="banheiro" fill="#76c7c0" />
              <Bar dataKey="lavanderia" fill="#ffbb33" />
              <Bar dataKey="cozinha" fill="#ff6f61" />
            </BarChart>
          </div>
        </div>

        <div className="graph">
          <h3>Consumo Mensal em Litros</h3>
          <BarChart width={800} height={300} data={monthlyConsumptionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis unit="L" />
            <Tooltip formatter={(value) => `${value} Litros`} />
            <Legend />
            <Bar dataKey="litros" fill="#3f51b5" />
          </BarChart>
        </div>
        <div class="alert-container">
  <div class="alert">
    <h4>Alerta de Consumo de Água</h4>
    <div class="alert-details">
      <p><strong>Consumo Atual:</strong> 850 Litros</p>
      <p><strong>Limite de Consumo:</strong> 1000 Litros</p>
      <p><strong>Consumo Restante:</strong> 150 Litros</p>
      <p><strong>Consumo Médio Diário:</strong> 28.33 Litros</p>
      <p><strong>Estimativa de Consumo para o Próximo Mês:</strong> 850.00 Litros</p>
    </div>
    <div class="alert-footer">
      <h5>Atenção:</h5>
      <p>Você está próximo de atingir o limite de consumo!</p>
      <h5>Recomendações:</h5>
      <ul>
        <li>Considere reduzir o consumo em horários de pico.</li>
        <li>Verifique possíveis vazamentos em sua residência.</li>
        <li>Utilize dispositivos de economia de água.</li>
      </ul>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}

export default UserProfile;
