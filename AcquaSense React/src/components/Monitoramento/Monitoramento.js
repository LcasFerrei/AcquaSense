import React, { useEffect, useState } from "react";
import './Monitoramento.css';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    BarChart,
    Bar
} from 'recharts';

function MonitoramentoAgua() {
    const [dailyConsumptionData, setDailyConsumptionData] = useState([
        { day: 'Seg', litros: 0 },
        { day: 'Ter', litros: 0 },
        { day: 'Qua', litros: 0 },
        { day: 'Qui', litros: 0 },
        { day: 'Sex', litros: 0 },
        { day: 'Sáb', litros: 0 },
        { day: 'Sun', litros: 0 },  // Corrigido para "Dom"
    ]);

    const [compartmentConsumptionData, setCompartmentConsumptionData] = useState([
        { day: 'Seg', banheiro: 0, lavanderia: 0, cozinha: 0, quarto: 0, quintal: 0 },
        { day: 'Ter', banheiro: 0, lavanderia: 0, cozinha: 0, quarto: 0, quintal: 0 },
        { day: 'Qua', banheiro: 0, lavanderia: 0, cozinha: 0, quarto: 0, quintal: 0 },
        { day: 'Qui', banheiro: 0, lavanderia: 0, cozinha: 0, quarto: 0, quintal: 0 },
        { day: 'Sex', banheiro: 0, lavanderia: 0, cozinha: 0, quarto: 0, quintal: 0 },
        { day: 'Sáb', banheiro: 0, lavanderia: 0, cozinha: 0, quarto: 0, quintal: 0 },
        { day: 'Sun', banheiro: 0, lavanderia: 0, cozinha: 0, quarto: 0, quintal: 0 },  // Corrigido para "Dom"
    ]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/monitoramento/');

        socket.onopen = () => {
            console.log('Conexão WebSocket estabelecida.');
        };

        socket.onclose = (event) => {
            console.log('Conexão WebSocket fechada: ', event);
        };

        socket.onerror = (error) => {
            console.error('Erro no WebSocket: ', error);
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Mensagem recebida: ", message);
            
            // Atualização do consumo total diário
            if (message.type === 'daily_sum') {
                const newRecord = message.data;
                setDailyConsumptionData((prevData) => {
                    const updatedData = prevData.map((data) =>
                        data.day === newRecord.day ? { ...data, litros: newRecord.litros } : data
                    );
                    return updatedData;
                });
            }

            // Atualização do consumo por compartimento
            if (message.type === 'compartment_sum') {
                const newCompartmentData = message.data;
                setCompartmentConsumptionData((prevData) => {
                    const updatedCompartmentData = prevData.map((data) =>
                        data.day === newCompartmentData.day
                            ? { ...data, ...newCompartmentData }
                            : data
                    );
                    return updatedCompartmentData;
                });
            }
        };

        return () => {
            socket.close();
        };
    }, []);

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
                        <Bar dataKey="quarto" fill="#8e44ad" />  {/* Adicionando o quarto */}
                        <Bar dataKey="quintal" fill="#e67e22" /> {/* Adicionando o quintal */}
                    </BarChart>
                </div>
            </div>
        </div>
    );
}

export default MonitoramentoAgua;
