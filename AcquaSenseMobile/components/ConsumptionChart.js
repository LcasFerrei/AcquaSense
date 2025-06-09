import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const ConsumptionChart = ({ data = {}, width = Dimensions.get('window').width * 0.9, height = 200 }) => {
  // Processa os dados de forma segura
  const processData = () => {
    const result = {
      labels: [],
      values: [],
      maxValue: 0
    };

    try {
      if (!data || Object.keys(data).length === 0) return result;
      
      const entries = Object.entries(data).sort();
      result.labels = entries.map(([time]) => time);
      result.values = entries.map(([, value]) => parseFloat(value) || 0);
      result.maxValue = Math.max(...result.values, 1); // Mínimo de 1 para evitar divisão por zero
      
      return result;
    } catch (error) {
      console.error('Error processing data:', error);
      return result;
    }
  };

  const { labels, values, maxValue } = processData();
  const hasData = values.length > 0;

  // Calcula a largura de cada barra
  const barWidth = hasData ? (width - 40) / values.length : 0;

  return (
    <View style={[styles.container, { width }]}>
      <Text style={styles.title}>Consumo Acumulado por Hora</Text>
      
      {!hasData ? (
        <View style={[styles.emptyState, { height }]}>
          <Text style={styles.emptyText}>Nenhum dado disponível</Text>
        </View>
      ) : (
        <>
          {/* Gráfico de barras */}
          <View style={styles.chartContainer}>
            {values.map((value, index) => (
              <View key={`bar-${index}`} style={styles.barContainer}>
                <View style={[
                  styles.bar,
                  { 
                    height: (value / maxValue) * (height - 60),
                    width: barWidth * 0.8
                  }
                ]}>
                  <View style={styles.barFill} />
                </View>
                {index % 2 === 0 && (
                  <Text style={styles.label}>
                    {labels[index]}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Legenda */}
          <View style={styles.legend}>
            <Text style={styles.summary}>
              Consumo acumulado: {values[values.length - 1]?.toFixed(1) || '0.0'} litros
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  emptyState: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  emptyText: {
    color: '#666',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  bar: {
    backgroundColor: '#A8B6FF',
    borderRadius: 4,
    marginHorizontal: 2,
    overflow: 'hidden',
  },
  barFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#A8B6FF',
  },
  label: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  legend: {
    marginTop: 10,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ConsumptionChart;