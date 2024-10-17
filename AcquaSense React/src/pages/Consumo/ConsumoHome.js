import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import HeaderNav from "../../components/AcquaNav/Header";
import '../../components/User/User.css';
import './ConsumoHome.css';

function ConsumoHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [porcentagemConsumo, setPorcentagemConsumo] = useState(0);
  const [porcentagemExibida, setPorcentagemExibida] = useState(0);
  const [fluxoConsumoData, setFluxoConsumoData] = useState([
    { horario: '08:35', consumo: 0 },
    { horario: '09:05', consumo: 30 },
    { horario: '10:15', consumo: 30 },
    { horario: '10:45', consumo: 60 },
    { horario: '12:00', consumo: 60 },
    { horario: '14:30', consumo: 80 },
    { horario: '15:00', consumo: 100 },
  ]);

  const limiteMaximo = 120;
  const consumoAtual = limiteMaximo * (porcentagemConsumo / 100);
  const consumoRestante = Math.max(0, limiteMaximo - consumoAtual);

  let status;
  if (porcentagemConsumo <= 50) {
    status = "Razoável";
  } else if (porcentagemConsumo <= 80) {
    status = "Atenção";
  } else {
    status = "Alarmante";
  }

  const COLORS = ['#0088FE', '#FFBB28'];

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/consumo/');
    socket.onopen = () => console.log("Conexão estabelecida");
    socket.onerror = (error) => console.error("Erro de conexão:", error);

    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log("Dados recebidos: ", data);
      if (data.type === "update") {
        animateProgress(data.data.percentual);
        setPorcentagemConsumo(data.data.percentual);
      }
    };

    return () => socket.close();
  }, []);

  const animateProgress = (newPercentual) => {
    const start = porcentagemExibida;
    const end = newPercentual;
    const duration = 1000;
    const stepTime = 10;
    let current = start;
    const increment = (end - start) / (duration / stepTime);

    const interval = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        clearInterval(interval);
        setPorcentagemExibida(end);
      } else {
        setPorcentagemExibida(current);
      }
    }, stepTime);
  };

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderCustomLabel = ({ cx, cy }) => {
    return (
      <text
        x={cx}
        y={cy}
        fill="#333"
        textAnchor="middle"
        dominantBaseline="middle"
        className="progress-label"
        style={{ fontSize: '24px', fontWeight: 'bold' }}
      >
        {`${porcentagemConsumo.toFixed(2)}%`}
      </text>
    );
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('graphs-container');
    html2canvas(input)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const pageHeight = 290;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        // Adiciona o título ao PDF
        pdf.setFontSize(16);
        pdf.text('Relatório de Consumo Hídrico Residencial - ACQUASENSE', 10, 10);
        pdf.addImage(imgData, 'PNG', 10, position + 10, imgWidth, imgHeight); // Adiciona a imagem abaixo do título
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('consumo_graficos.pdf');
      })
      .catch(error => console.error('Erro ao gerar PDF:', error));
  };

  const handleLogout = () => {
    // Aqui você pode adicionar a lógica de logout
    // Por exemplo, limpar tokens ou informações de sessão
    console.log("Usuário deslogado");
    // Redirecionar para a raiz da página
    window.location.href = '/';
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR');

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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
              <li><a href="/" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
          </nav>
        </div>
      </aside>

      <div className={`dashboard-main-content ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
        <HeaderNav handleMenuToggle={handleMenuToggle} />

        <div className="consumo-home" id="graphs-container">
          <div className="graph">
            <h3>Progresso do Consumo de Água</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <ResponsiveContainer width={300} height={300}>
                <PieChart>
                  <Pie
                    data={[{
                      name: 'Consumido',
                      value: consumoAtual
                    }, {
                      name: 'Restante',
                      value: consumoRestante
                    }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    fill="#82ca9d"
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    <Cell key="consumido" fill="#0088FE" />
                    <Cell key="restante" fill="#FFBB28" />
                  </Pie>
                  <Tooltip formatter={(value) => `${value} Litros`} />
                </PieChart>
              </ResponsiveContainer>

              <div>
                <h3>Status: {status}</h3>
                <p>Você já consumiu <strong>{porcentagemConsumo.toFixed(2)}%</strong> do seu limite diário de água.</p>
              </div>
            </div>
          </div>

          <div className="graph">
            <h3>Consumo Diário: {formattedDate} (Litros)</h3>
            <LineChart width={650} height={300} data={fluxoConsumoData}>
              <Line type="monotone" dataKey="consumo" stroke="#3f51b5" strokeWidth={3} />
              <CartesianGrid stroke="#e0e0e0" />
              <XAxis dataKey="horario" />
              <YAxis unit=" L" />
              <Tooltip formatter={(value) => `${value} Litros`} />
              <Legend />
            </LineChart>
          </div>
        </div>

        <button className="pdf-button" onClick={handleDownloadPDF}>
          <i className="fas fa-file-pdf"></i> Baixar Relatório em PDF
        </button>
      </div>
    </div>
  );
}

export default ConsumoHome;
