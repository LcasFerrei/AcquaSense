import React from "react";
import './Monitoramento.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';

function MonitoramentoAgua() {
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

    const totalConsumption = 850; // Consumo total fictício em litros
    const consumptionLimit = 1000; // Limite de consumo fictício em litros
    const remainingConsumption = consumptionLimit - totalConsumption;
    const averageDailyConsumption = (totalConsumption / 30).toFixed(2);
    const monthlyEstimate = ((totalConsumption / 30) * 30).toFixed(2);

    return (
        <div className="user-graphs-container">
            <div className="user-graphs">
                <div className="graph">
                    <h3>Consumo Diário em Litros da Residência</h3>
                    <LineChart width={650} height={300} data={dailyConsumptionData}>
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
                    <BarChart width={650} height={300} data={compartmentConsumptionData}>
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
        </div>
    );
}

export default MonitoramentoAgua;
