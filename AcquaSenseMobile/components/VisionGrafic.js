import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Dimensões da tela para o gráfico
const screenWidth = Dimensions.get('window').width;

const VisionGrafic = ({ navigation }) => {
  // Dados fictícios para o gráfico (você pode ajustar conforme necessário)
  const data = {
    labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50], // PIA 1
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Azul
        strokeWidth: 2,
      },
      {
        data: [30, 25, 60, 40, 70, 20, 80], // PIA 2
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Rosa
        strokeWidth: 2,
      },
      {
        data: [50, 55, 40, 60, 45, 65, 30], // Limite Médio
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Verde
        strokeWidth: 2,
      },
    ],
    legend: ['PIA 1', 'PIA 2', 'Limite Médio'],
  };

  // Dados fictícios para o histórico de manutenção com emojis
  const maintenanceHistory = [
    { id: '1', title: 'PIA 1 - Cozinha', icon: '🚰' }, // Emoji de pia
    { id: '2', title: 'PIA 2 - Cozinha', icon: '🚰' }, // Emoji de pia
    { id: '3', title: 'Banheiro 1', icon: '🚽' }, // Emoji de banheiro
    { id: '4', title: 'Banheiro 2', icon: '🚽' }, // Emoji de banheiro
  ];

  // Renderizar cada item do histórico
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigation.navigate('DeviceHistory', { deviceTitle: item.title })} // Adiciona a navegação
    >
      <View style={styles.historyContent}>
        <Text style={styles.historyIcon}>{item.icon}</Text>
        <Text style={styles.historyText}>{item.title}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Seção: Consumo de água por dispositivo */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Consumo de água por dispositivo</Text>
        <LineChart
          data={data}
          width={screenWidth - 40} // Ajustado para caber na tela
          height={220}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#fff',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      {/* Seção: Histórico de manutenção */}
      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Histórico do sensor</Text>
        <FlatList
          data={maintenanceHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false} // Desativa o scroll do FlatList
          nestedScrollEnabled={true} // Permite que o ScrollView pai gerencie o scroll
        />
      </View>

      {/* Seção: Vazão Média */}
      <View style={styles.flowContainer}>
        <Text style={styles.sectionTitle}>Vazão Média</Text>
        <View style={styles.flowCircle}>
          <Text style={styles.flowText}>20 L/H</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
  },
  historyContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
  },
  flowContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    fontSize: 20, // Tamanho do emoji
    marginRight: 10, // Espaço entre o emoji e o texto
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  arrow: {
    fontSize: 16,
    color: '#333',
  },
  flowCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4BC0C0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  flowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default VisionGrafic;