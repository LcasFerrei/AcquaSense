import React, { useEffect, useState } from 'react';
import './Monitoramento.css'; // Importa o CSS

const SpecificMonitoring = () => {
    const [consumoData, setConsumoData] = useState(null);
    const [month, setMonth] = useState('2024-10'); // Mês padrão

    useEffect(() => {
        const fetchConsumptionData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/SpecificMonitoring/?month=${month}`);
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                const data = await response.json();
                console.log(data);
                setConsumoData(data);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchConsumptionData();
    }, [month]); // Executa a função quando o componente é montado ou o mês é alterado

    return (
        <section className="monitoring-section">
            <div className="title-container">
                <h2><i className="fas fa-eye"></i> Monitoramento Específico</h2>
            </div>
            <div className='container-fluid'>
                <label className="label" htmlFor="month">Selecione o mês:</label>
                <input
                    type="month"
                    id="month"
                    className="input-month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                />
                {consumoData ? (
                    <div>
                        <div className="consumo-total">
                            <h2>Consumo Total: {consumoData.consumo_total} L</h2>
                        </div>
                        <h3>Consumo por Ponto de Uso:</h3>
                        <ul className="pontos-uso">
                            {Object.entries(consumoData.consumo_por_ponto).map(([ponto, info]) => (
                                <li key={ponto} className="ponto-uso">
                                    <span>{ponto}</span>
                                    <span>{info.consumo} L ({info.porcentagem}%)</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="loading">Carregando dados...</p>
                )}
            </div>
        </section>
    );
};

export default SpecificMonitoring;
// Tela monitoramento especifico
