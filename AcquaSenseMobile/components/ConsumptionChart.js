import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const ConsumptionChart = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth * 0.9;
  const chartHeight = 220;
  const padding = 20;
  const leftPadding = 30; // Espaço para os labels do eixo Y

  // Função para preencher intervalos vazios (mantida da implementação original)
  const preencherIntervalosVazios = (acumuladoPorHora) => {
    const now = new Date();
    const horasPreenchidas = {};
    let ultimoValor = 0;

    for (let hora = 0; hora <= now.getHours(); hora++) {
      for (let minuto = 0; minuto < 60; minuto++) {
        const horario = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        
        if (acumuladoPorHora[horario] !== undefined) {
          ultimoValor = acumuladoPorHora[horario];
        }
        
        horasPreenchidas[horario] = ultimoValor;
        
        if (hora === now.getHours() && minuto === now.getMinutes()) {
          break;
        }
      }
    }

    return horasPreenchidas;
  };

  // Processa os dados para o gráfico
  const processChartData = () => {
    if (!data || Object.keys(data).length === 0) {
      return {
        labels: [],
        dataPoints: [],
        isEmpty: true
      };
    }

    const dadosCompletos = preencherIntervalosVazios(data);
    const dataArray = Object.entries(dadosCompletos).map(([time, value]) => ({
      time,
      value
    }));

    // Seleciona labels estratégicos (a cada 3 horas)
    const labels = [];
    const allTimes = dataArray.map(item => item.time);
    
    for (let hora = 0; hora <= 24; hora += 3) {
      const timeStr = `${hora.toString().padStart(2, '0')}:00`;
      if (allTimes.includes(timeStr) || hora === 0) {
        labels.push(timeStr);
      }
    }

    // Adiciona o último horário se não estiver incluído
    const lastTime = dataArray[dataArray.length - 1].time;
    if (!labels.includes(lastTime)) {
      labels.push(lastTime);
    }

    return {
      labels,
      dataPoints: dataArray.map(item => item.value),
      times: dataArray.map(item => item.time),
      isEmpty: false
    };
  };

  const chartData = processChartData();
  const totalConsumption = chartData.isEmpty ? 0 : 
    chartData.dataPoints.slice(-1)[0].toFixed(1);

  // Calcula as posições dos pontos no gráfico
  const calculatePoints = (dataPoints, width, height) => {
    if (dataPoints.length === 0) return [];
    
    const maxValue = Math.max(...dataPoints);
    const minValue = Math.min(...dataPoints);
    const range = maxValue - minValue || 1; // Evita divisão por zero
    
    return dataPoints.map((value, index) => {
      const x = leftPadding + (index / (dataPoints.length - 1)) * (width - leftPadding - padding);
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
      return { x, y, value };
    });
  };

  const points = calculatePoints(chartData.dataPoints, chartWidth, chartHeight);

  // Cria os segmentos de linha entre os pontos
  const renderLines = () => {
    if (points.length < 2) return null;

    return points.slice(1).map((point, index) => {
      const prevPoint = points[index];
      
      // Calcula o ângulo para a linha
      const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x) * (180 / Math.PI);
      const length = Math.sqrt(
        Math.pow(point.x - prevPoint.x, 2) + 
        Math.pow(point.y - prevPoint.y, 2)
      );

      return (
        <View
          key={index}
          style={[
            styles.lineSegment,
            {
              left: prevPoint.x,
              top: prevPoint.y,
              width: length,
              transform: [{ rotate: `${angle}deg` }],
              height: 2,
            }
          ]}
        />
      );
    });
  };

  // Renderiza os pontos do gráfico
  const renderPoints = () => {
    return points.map((point, index) => (
      <View
        key={index}
        style={[
          styles.dataPoint,
          {
            left: point.x - 2,
            top: point.y - 2,
          }
        ]}
      />
    ));
  };

  // Renderiza os labels do eixo X
  const renderXAxisLabels = () => {
    if (chartData.isEmpty) return null;

    return chartData.labels.map((label, index) => {
      // Encontra o índice correspondente no array completo de tempos
      const timeIndex = chartData.times.indexOf(label);
      if (timeIndex === -1) return null;

      const position = leftPadding + (timeIndex / (chartData.times.length - 1)) * (chartWidth - leftPadding - padding);
      
      return (
        <View
          key={index}
          style={[
            styles.xAxisLabel,
            {
              left: position - 20,
            }
          ]}
        >
          <Text style={styles.labelText}>{label}</Text>
        </View>
      );
    });
  };

  // Renderiza linhas horizontais de guia
  const renderGridLines = () => {
    if (chartData.isEmpty) return null;
    
    const maxValue = Math.max(...chartData.dataPoints);
    const minValue = Math.min(...chartData.dataPoints);
    const range = maxValue - minValue || 1;
    const steps = 4;
    
    return Array.from({ length: steps + 1 }).map((_, index) => {
      const value = minValue + (range / steps) * index;
      const y = chartHeight - padding - ((value - minValue) / range) * (chartHeight - padding * 2);
      
      return (
        <React.Fragment key={index}>
          <View
            style={[
              styles.gridLine,
              {
                top: y,
                width: chartWidth - leftPadding,
                left: leftPadding,
              }
            ]}
          />
          <Text style={[
            styles.gridLabel,
            {
              top: y - 8,
              left: 5,
            }
          ]}>
            {value.toFixed(1)}
          </Text>
        </React.Fragment>
      );
    });
  };

  return (
    <View>
      <Text style={styles.title}>
          Consumo Acumulado por Hora
      </Text>
      <View style={styles.container}>
        {chartData.isEmpty ? (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyText}>...</Text>
          </View>
        ) : (
          <>
            <View style={styles.chartWrapper}>
              <View style={styles.chartContainer}>
                {/* Grade de fundo */}
                {renderGridLines()}
                
                {/* Linhas do gráfico */}
                <View style={styles.chartLines}>
                  {renderLines()}
                </View>
                
                {/* Pontos do gráfico */}
                <View style={styles.chartPoints}>
                  {renderPoints()}
                </View>
                
                {/* Linha do eixo X */}
                <View style={[
                  styles.xAxisLine,
                  {
                    left: leftPadding,
                    width: chartWidth - leftPadding - padding,
                  }
                ]} />
                
                {/* Eixo X */}
                <View style={styles.xAxis}>
                  {renderXAxisLabels()}
                </View>
              </View>
            </View>
            
          </>
        )}
      </View>
      <Text style={styles.totalText}>
        Consumo acumulado: {totalConsumption} litros
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginVertical: 20,
    backgroundColor: 'transparent',
    width: '100%',
    marginRight: 250,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    width: '90%',
    textAlign: 'center',
    marginLeft: 60,
  },
  emptyChart: {
    width: '90%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 16
  },
  emptyText: {
    color: '#666',
    backgroundColor: 'transparent'
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    marginRight: 100,
  },
  chartContainer: {
    width: '80%',
    height: 220,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  chartLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  chartPoints: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  lineSegment: {
    position: 'absolute',
    backgroundColor: '#A8B6FF',
    transformOrigin: 'left center',
  },
  dataPoint: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 4,
    backgroundColor: '#A8B6FF',
  },
  xAxis: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    height: 20,
  },
  xAxisLine: {
    position: 'absolute',
    bottom: 20,
    height: 1,
    backgroundColor: '#ccc',
  },
  xAxisLabel: {
    position: 'absolute',
    bottom: 0,
    width: 40,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 10,
    color: '#666',
  },
  gridLine: {
    position: 'absolute',
    borderTopWidth: 1,
    borderTopColor: 'rgba(200, 200, 200, 0.5)',
    height: 1,
  },
  gridLabel: {
    position: 'absolute',
    fontSize: 10,
    color: '#666',
    width: 30,
    textAlign: 'right',
  },
  totalText: {
    marginTop: 8,
    color: '#666',
    width: '90%',
    textAlign: 'center',
    marginLeft: 90,
  }
});

export default ConsumptionChart;