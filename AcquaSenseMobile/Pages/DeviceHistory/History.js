import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ImageBackground, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Hubfooter from '../../components/hub';

// Dimensões da tela para os gráficos
const screenWidth = Dimensions.get('window').width;

const History = () => {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('6 meses'); // Estado para o período selecionado
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal

  // Opções de período
  const periodOptions = [
    { label: 'Últimos 6 meses', value: '6 meses' },
    { label: 'Últimos 3 meses', value: '3 meses' },
    { label: 'Último 1 mês', value: '1 mês' },
    { label: 'Última 1 semana', value: '1 semana' },
  ];

  // Dados fictícios para o gráfico de linha com base no período selecionado
  const getLineChartData = () => {
    switch (selectedPeriod) {
      case '6 meses':
        return {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [
            {
              data: [15, 45, 30, 60, 45, 75], // 2023
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: [30, 60, 45, 75, 60, 90], // 2024
              color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ['2023', '2024'],
        };
      case '3 meses':
        return {
          labels: ['Abr', 'Mai', 'Jun'],
          datasets: [
            {
              data: [60, 45, 75], // 2023
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: [75, 60, 90], // 2024
              color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ['2023', '2024'],
        };
      case '1 mês':
        return {
          labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
          datasets: [
            {
              data: [10, 15, 12, 18], // 2023
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: [12, 18, 15, 20], // 2024
              color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ['2023', '2024'],
        };
      case '1 semana':
        return {
          labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
          datasets: [
            {
              data: [5, 7, 6, 8, 9, 4, 3], // 2023
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: [6, 8, 7, 9, 10, 5, 4], // 2024
              color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ['2023', '2024'],
        };
      default:
        return {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [
            {
              data: [15, 45, 30, 60, 45, 75],
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: [30, 60, 45, 75, 60, 90],
              color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ['2023', '2024'],
        };
    }
  };

  const lineChartData = getLineChartData();

  // Dados fictícios para o gráfico de barras (Consumo acumulado por dia da semana)
  const barChartData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [120, 110, 90, 80, 70, 60, 50],
      },
    ],
  };

  // Dados fictícios para a lista de histórico
  const historyList = [
    { id: '1', date: '02/04/2025', percentage: '80%' },
    { id: '2', date: '01/04/2025', percentage: '91%' },
  ];

  // Renderiza cada item da lista de histórico
  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyDate}>{item.date}</Text>
      <Text style={styles.historyPercentage}>{item.percentage}</Text>
    </View>
  );

  // Verificar se os dados dos gráficos estão definidos
  if (!lineChartData || !lineChartData.datasets || !lineChartData.labels) {
    console.log('Erro: Dados do LineChart inválidos:', lineChartData);
    return (
      <View style={styles.container}>
        <Text>Erro: Dados do gráfico de linha inválidos.</Text>
      </View>
    );
  }

  if (!barChartData || !barChartData.datasets || !barChartData.labels) {
    console.log('Erro: Dados do BarChart inválidos:', barChartData);
    return (
      <View style={styles.container}>
        <Text>Erro: Dados do gráfico de barras inválidos.</Text>
      </View>
    );
  }

  // Função para obter o rótulo do período selecionado
  const getSelectedPeriodLabel = () => {
    const selected = periodOptions.find((option) => option.value === selectedPeriod);
    return selected ? selected.label : 'Últimos 6 meses';
  };

  return (
    <ImageBackground 
      source={require('../../assets/Pag_Home.png')}
      style={styles.backgroundImage}
      onError={(error) => console.log('Erro ao carregar imagem de fundo:', error.nativeEvent)}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>{"<"}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Histórico</Text>

          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>{"..."}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {/* Gráfico de Linha: Histórico dos últimos 6 meses */}
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Text style={styles.sectionTitle}>Histórico</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.dropdownButtonText}>{getSelectedPeriodLabel()}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>
            <LineChart
              data={lineChartData}
              width={screenWidth - 40}
              height={220}
              yAxisSuffix=""
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

          {/* Gráfico de Barras: Consumo acumulado */}
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Consumo acumulado</Text>
            <BarChart
              data={barChartData}
              width={screenWidth - 40}
              height={220}
              yAxisSuffix=" Litros"
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.5,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>

          {/* Lista de Histórico */}
          <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>Histórico</Text>
            <FlatList
              data={historyList}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        {/* Modal para seleção de período */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              {periodOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalItem,
                    selectedPeriod === option.value && styles.selectedModalItem,
                  ]}
                  onPress={() => {
                    setSelectedPeriod(option.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedPeriod === option.value && styles.selectedModalItemText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <Hubfooter />
      </View>
    </ImageBackground>
  );
};

// Adicione os novos estilos para o dropdown personalizado
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  backButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  menuButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 20,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#666',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 200,
    paddingVertical: 10,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectedModalItem: {
    backgroundColor: '#007AFF',
  },
  modalItemText: {
    fontSize: 14,
    color: '#333',
  },
  selectedModalItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  historyContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 20,
    marginBottom: 100,
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyDate: {
    fontSize: 14,
    color: '#333',
  },
  historyPercentage: {
    fontSize: 14,
    color: '#666',
  },
});

export default History;