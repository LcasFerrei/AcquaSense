import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const ConsumptionChart = () => {
  const screenWidth = Dimensions.get('window').width;

  // Dados do gráfico
  const chartData = {
    labels: ['6:00', '9:00', '12:00', '15:00', '18:00', '21:00'],
    datasets: [
      {
        data: [0, 0, 10, 0, 0, 0], // Dados de exemplo para o gráfico
        strokeWidth: 2,
      },
    ],
  };

  // Função para determinar a cor dos rótulos com base na hora atual
  const getLabelColor = (label, opacity = 1) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHour + currentMinutes / 60; // Converte para decimal (ex.: 9:30 = 9.5)

    // Definindo as faixas de horário
    const isBetween9And1159 = currentTime >= 9 && currentTime <= 11.99; // 9:00 até 11:59
    const isBetween18And2059 = currentTime >= 18 && currentTime <= 22.99; // 18:00 até 20:59

    // Cor padrão (preto)
    let color = `rgba(0, 0, 0, ${opacity})`;

    // Gradiente simulado entre C58BF2 e EEA4CE (média das cores como aproximação)
    const gradientColor = `rgba(215, 163, 216, ${opacity})`; // Média aproximada entre C58BF2 e EEA4CE

    // Aplica a cor gradiente para o rótulo "9:00" se estiver entre 9:00 e 11:59
    if (isBetween9And1159 && label === '9:00') {
      color = gradientColor;
    }

    // Aplica a cor gradiente para o rótulo "18:00" se estiver entre 18:00 e 20:59
    if (isBetween18And2059 && label === '21:00') {
      color = gradientColor;
    }

    return color;
  };

  // Configuração do gráfico
  const chartConfig = {
    backgroundColor: '#e6f0fa',
    backgroundGradientFrom: '#e6f0fa',
    backgroundGradientTo: '#e6f0fa',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Cor da linha (azul)
    labelColor: (labelIndex, opacity = 1) => {
      // Mapeia o índice do rótulo para o texto do rótulo
      const label = chartData.labels[labelIndex];
      return getLabelColor(label, opacity);
    },
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
  };

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        O consumo está equilibrado
      </Text>
      <LineChart
        data={chartData}
        width={screenWidth * 0.9} // 90% da largura da tela
        height={220}
        chartConfig={chartConfig}
        bezier // Curva suave
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withVerticalLines={false} // Remove linhas verticais do grid
        yAxisLabel=""
        yAxisSuffix="%"
      />
    </View>
  );
};

export default ConsumptionChart;