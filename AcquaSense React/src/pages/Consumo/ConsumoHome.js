import React, { useEffect, useState } from 'react';

import HeaderNav from "../../components/AcquaNav/Header";
import '../../pages/Consumo/ConsumoHome.css';

function ConsumoHome() {
  // Definindo o estado para armazenar os registros
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    // Conectando ao WebSocket no Django
    const socket = new WebSocket('ws://localhost:8000/ws/consumo/');
    socket.onopen = () => console.log("Conexão estabelecida");
    socket.onerror = (error) => console.error("Erro de conexão:", error);

    // Definir comportamento ao receber mensagem
    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log(data);  // Para verificar o que está sendo recebido

      if (data.type === "initial") {
        // Quando receber o tipo inicial, armazena os registros no estado
        setRegistros(data.data);
      } else if (data.type === "update") {
        // Quando receber o tipo de atualização, atualiza os registros
        setRegistros(data.data);
      }
    };

    // Fechar o socket quando o componente desmontar
    return () => socket.close();
  }, []);

  return (
    <div>
      <HeaderNav />
      <div className="consumo-home">
        <table className="consumo-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data/Hora</th>
              <th>Consumo</th>
              <th>Sensor</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id}>
                <td>{registro.id}</td>
                <td>{registro.data_hora}</td>
                <td>{registro.consumo}</td>
                <td>{registro.sensor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ConsumoHome;
