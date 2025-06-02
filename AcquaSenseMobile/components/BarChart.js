import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { getToken } from './Noti';

const BarChart = () => {
  const [consumoData, setConsumoData] = useState(null);
  const HIGH_THRESHOLD = 70;
  const MAX_CHART_HEIGHT = 150; // Altura máxima do gráfico
  const MAX_VALUE = 200; // Valor que deve ocupar a altura máxima

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const response = await axios.get('https://acquasense.onrender.com/relatorio-consumo-semanal/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setConsumoData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  if (!consumoData) {
    return <Text>Carregando...</Text>;
  }

  // Normaliza os valores para que 120 ocupe MAX_CHART_HEIGHT
  const normalizedData = consumoData.consumos.map(value =>
    Math.min((value / MAX_VALUE) * MAX_CHART_HEIGHT, MAX_CHART_HEIGHT)
  );

  return (
    <View style={styles.container}>
      {/* Labels dos dias acima das barras */}
      <View style={styles.labelsContainer}>
        {consumoData.dias.map((day, index) => (
          <Text key={index} style={styles.dayLabel}>{day}</Text>
        ))}
      </View>

      {/* Gráfico de barras */}
      <View style={[styles.chart, { height: MAX_CHART_HEIGHT }]}>
        {normalizedData.map((value, index) => {
          const isHighConsumption = consumoData.consumos[index] > HIGH_THRESHOLD;
          const colors = isHighConsumption
            ? ['#C58BF2', '#EEA4CE']
            : ['#92A3FD', '#9DCEFF'];

          return (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barContainer}>
                <View style={[styles.barBackground, { height: MAX_CHART_HEIGHT }]} />
                <LinearGradient
                  colors={colors}
                  style={[styles.bar, { height: value }]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10, // Espaço entre os labels e as barras
  },
  dayLabel: {
    fontSize: 12,
    color: '#1D1617',
    textAlign: 'center',
    width: 40, // Largura fixa para cada label
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  barBackground: {
    width: 20,
    backgroundColor: '#F7F8F8',
    borderRadius: 20,
    position: 'absolute',
    bottom: 0,
  },
  bar: {
    width: 20,
    borderRadius: 20,
    marginBottom: 4,
  },
});

export default BarChart;