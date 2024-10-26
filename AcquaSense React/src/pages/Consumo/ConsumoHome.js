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
  const [acumuladoPorHora, setAcumuladoPorHora] = useState([]);
  const [horaAtual, setHoraAtual] = useState('');

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
  const horas = ['00:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

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
    
        if (data.data.acumulado_por_hora) {
          const updatedData = preencherIntervalosVazios(data.data.acumulado_por_hora);
          setAcumuladoPorHora(updatedData);
        }
      }
    };
  
    const interval = setInterval(() => {
      const now = new Date();
      setHoraAtual(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 60000);
  
    return () => {
      clearInterval(interval);
      socket.close();
    };
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

  const preencherIntervalosVazios = (acumuladoPorHora) => {
    const now = new Date();
    const horasPreenchidas = {};
    let ultimoValor = 0;
  
    // Preenche as horas do dia, do início (00:00) até a hora atual
    for (let hora = 0; hora <= now.getHours(); hora++) {
      for (let minuto = 0; minuto < 60; minuto++) {
        const horario = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
  
        // Usa o valor do acumuladoPorHora se existir, caso contrário, mantém o último valor conhecido
        if (acumuladoPorHora[horario] !== undefined) {
          ultimoValor = acumuladoPorHora[horario];
        }
  
        horasPreenchidas[horario] = ultimoValor;
        
        // Para evitar adicionar minutos além do horário atual
        if (hora === now.getHours() && minuto === now.getMinutes()) {
          break;
        }
      }
    }
  
    // Converte o objeto em um array para o gráfico
    return Object.keys(horasPreenchidas).map((hora) => ({
      horario: hora,
      consumo: horasPreenchidas[hora],
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
          <p style={{ color: 'rgb(136, 132, 216)' }}>{`Hora: ${label}`}</p>
          <p style={{ color: 'rgb(136, 132, 216)' }}>{`Consumo: ${payload[0].value} litros`}</p>
        </div>
      );
    }
  
    return null;
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
              <ResponsiveContainer width="100%" height={300}>
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
                    {([{
                      name: 'Consumido',
                      value: consumoAtual
                    }, {
                      name: 'Restante',
                      value: consumoRestante
                    }]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="progress-info">
                <p>Status: {status}</p>
                <p>Consumo Atual: {consumoAtual.toFixed(2)} litros</p>
                <p>Consumo Restante: {consumoRestante.toFixed(2)} litros</p>
                <p>Data: {formattedDate}</p>
                <button onClick={handleDownloadPDF}>Baixar PDF</button>
              </div>
            </div>
          </div>

          <div className="graph">
            <h3>Consumo Acumulado por Hora</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={acumuladoPorHora}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="horario" ticks={['00:00', '09:00', '12:00', '15:00', '18:00', '21:00']} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="consumo"
                  stroke="#8884d8"
                  dot={false} // Isso remove os pontos, apenas desenhando a linha.
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsumoHome;
