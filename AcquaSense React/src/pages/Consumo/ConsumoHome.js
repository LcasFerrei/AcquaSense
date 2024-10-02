import React, { useState, useEffect } from 'react';
import HeaderNav from "../../components/AcquaNav/Header";
import './ConsumoHome.css';
import '../../components/User/User.css';

function ConsumoHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  // Definir a função handleMenuToggle
  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="dashboard-logo-menu">
          <div className="dashboard-logo">
            <a href="/index.html" className="dashboard-logo-link">
              <h1>AcquaSense</h1>
            </a>
          </div>
          <nav className="dashboard-nav">
            <ul>
              <li><a href="/Userpage"><i className="fa-solid fa-user"></i> Meu Perfil</a></li>
              <li><a href="/Dashboard"><i className="fas fa-chart-line"></i> Dashboard</a></li>
              <li><a href="/Consumptiondaily"><i className="fas fa-tint"></i> Consumo Diário</a></li>
              <li><a href="/Maintenance"><i className="fas fa-tools"></i> Manutenção</a></li>
              <li><a href="/SpecificMonitoring"><i className="fas fa-eye"></i> Monitoramento Específico</a></li>
              <li><a href="/Configuration"><i className="fa-solid fa-gear"></i> Configuração</a></li>
              <li><a href="/login"><i className="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
        <HeaderNav handleMenuToggle={handleMenuToggle} />
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
    </div>
  );
}

export default ConsumoHome;
