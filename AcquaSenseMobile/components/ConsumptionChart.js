import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const ConsumptionChart = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;

  // Função para preencher intervalos vazios
  const preencherIntervalosVazios = (acumuladoPorHora) => {
    const now = new Date();
    const horasPreenchidas = {};
    let ultimoValor = 0;

    // Preenche do início do dia até agora
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
        datasets: [{ data: [] }],
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
      datasets: [{
        data: dataArray.map(item => item.value),
      }],
      isEmpty: false
    };
  };

  const chartData = processChartData();

  // Configuração do gráfico sem pontos
  const chartConfig = {
    backgroundColor: '#ffffff00',  // Cor de fundo branca
    backgroundGradientFrom: '#ffffff00',  // Cor de fundo branca para o gradiente
    backgroundGradientTo: '#ffffff00',  // Cor de fundo branca para o gradiente
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0', // Remove completamente os pontos
    },
    propsForLabels: {
      fontSize: 10
    },
    fillShadowGradient: 'rgba(0, 150, 136, 0.1)',  // Cor de preenchimento com opacidade
    fillShadowGradientOpacity: 0.1
  };

  // Calcula o consumo total (último valor)
  const totalConsumption = chartData.isEmpty ? 0 : 
    chartData.datasets[0].data.slice(-1)[0].toFixed(1);

  return (
    <View style={{ alignItems: 'center', marginVertical: 20, backgroundColor: 'transparent' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
        Consumo Acumulado por Hora
      </Text>
      
      {chartData.isEmpty ? (
        <View style={{ 
          width: screenWidth * 0.9, 
          height: 220, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'transparent', // Garantindo fundo transparente
          borderRadius: 16
        }}>
          <Text style={{ color: '#666', backgroundColor:'transparent' }}>...</Text>
        </View>
      ) : (
        <>
          <LineChart
            data={chartData}
            width={screenWidth * 0.9}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              backgroundColor: 'transparent',  // Garantindo fundo transparente
            }}
            withVerticalLines={false}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            withInnerLines={false}
            segments={4}
          />
          <Text style={{ marginTop: 8, color: '#666' }}>
            Consumo acumulado: {totalConsumption} litros
          </Text>
        </>
      )}
    </View>
  );
};

export default ConsumptionChart;