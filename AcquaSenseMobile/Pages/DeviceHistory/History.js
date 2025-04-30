import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity, 
  ImageBackground, 
  Dimensions, 
  Modal, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Hubfooter from '../../components/hub';

const screenWidth = Dimensions.get('window').width;

const History = () => {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('6 meses');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [consumoData, setConsumoData] = useState(null);
  const [error, setError] = useState(null);

  const periodOptions = [
    { label: 'Últimos 6 meses', value: '6 meses' },
    { label: 'Últimos 3 meses', value: '3 meses' },
    { label: 'Último 1 mês', value: '1 mês' },
    { label: 'Última 1 semana', value: '1 semana' },
  ];

  const fetchConsumoData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://192.168.0.3:8000/relatorio-consumo/?periodo=${selectedPeriod}`);
      const data = await response.json();

      if (data.status === 'success') {
        setConsumoData(data);
      } else {
        throw new Error(data.message || 'Erro ao carregar dados');
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message || 'Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConsumoData();
  };

  useEffect(() => {
    fetchConsumoData();
  }, [selectedPeriod]);

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyDate}>{item.date}</Text>
      <Text style={styles.historyPercentage}>{item.percentage}</Text>
    </View>
  );

  const getSelectedPeriodLabel = () => {
    const selected = periodOptions.find((option) => option.value === selectedPeriod);
    return selected ? selected.label : 'Últimos 6 meses';
  };

  if (loading && !refreshing) {
    return (
      <ImageBackground 
        source={require('../../assets/Pag_Home.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground 
        source={require('../../assets/Pag_Home.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchConsumoData}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={require('../../assets/Pag_Home.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>{"<"}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Histórico de Consumo</Text>

          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>{"..."}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor={'#007AFF'}
            />
          }
        >
          {/* Resumo do consumo */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Semana Atual</Text>
              <Text style={styles.summaryValue}>
                {consumoData?.semana_atual?.total_litros?.toFixed(1) || '0.0'} L
              </Text>
              <Text style={styles.summaryPeriod}>
                {consumoData?.semana_atual?.periodo?.inicio || '--/--/----'} - {consumoData?.semana_atual?.periodo?.fim || '--/--/----'}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Últimos 5 Dias</Text>
              <Text style={[styles.summaryValue, 
                {color: (consumoData?.ultimos_5_dias?.porcentagem_consumo || 0) > 80 ? '#FF4500' : '#007AFF'}]}>
                {consumoData?.ultimos_5_dias?.porcentagem_consumo || '--'}%
              </Text>
              <Text style={styles.summaryPeriod}>
                {consumoData?.ultimos_5_dias?.total_litros?.toFixed(1) || '--'}L de {consumoData?.ultimos_5_dias?.meta_litros || '--'}L
              </Text>
            </View>
          </View>

          {/* Gráfico de Linha para os últimos 5 dias */}
          {consumoData?.ultimos_5_dias?.consumo_por_dia && (
            <View style={styles.chartContainer}>
              <Text style={styles.sectionTitle}>Consumo nos últimos 5 dias</Text>
              <LineChart
                data={{
                  labels: consumoData.ultimos_5_dias.consumo_por_dia.labels,
                  datasets: [{
                    data: consumoData.ultimos_5_dias.consumo_por_dia.valores,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    strokeWidth: 2
                  }]
                }}
                width={screenWidth - 40}
                height={220}
                yAxisSuffix="L"
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#007AFF',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
              <Text style={styles.chartNote}>
                Total: {consumoData.ultimos_5_dias.total_litros?.toFixed(1) || '0.0'}L ({consumoData.ultimos_5_dias.porcentagem_consumo || '0'}% da meta)
              </Text>
            </View>
          )}

          {/* Gráfico de Linha: Histórico */}
          {consumoData?.line_chart && (
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Text style={styles.sectionTitle}>Histórico de Consumo</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.dropdownButtonText}>{getSelectedPeriodLabel()}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>
              <LineChart
                data={{
                  labels: consumoData.line_chart.labels,
                  datasets: [{
                    data: consumoData.line_chart.datasets[0].data,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    strokeWidth: 2
                  }]
                }}
                width={screenWidth - 40}
                height={220}
                yAxisSuffix="L"
                yAxisInterval={1}
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
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#007AFF',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          )}

          {/* Gráfico de Barras: Consumo semanal */}
          {consumoData?.semana_atual?.grafico_diario && (
            <View style={styles.chartContainer}>
              <Text style={styles.sectionTitle}>Consumo Diário (Semana Atual)</Text>
              <BarChart
                data={{
                  labels: consumoData.semana_atual.grafico_diario.dias,
                  datasets: [{
                    data: consumoData.semana_atual.grafico_diario.consumo
                  }]
                }}
                width={screenWidth - 40}
                height={220}
                yAxisSuffix="L"
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
          )}

          {/* Lista de Histórico */}
          <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>Registros Recentes</Text>
            <FlatList
              data={[
                { 
                  id: '1', 
                  date: consumoData?.semana_atual?.periodo?.inicio || '--/--/----', 
                  percentage: `${consumoData?.semana_atual?.total_litros ? Math.round((consumoData.semana_atual.total_litros / 350) * 100) : '--'}%` 
                },
                { 
                  id: '2', 
                  date: 'Últimos 5 dias', 
                  percentage: `${consumoData?.ultimos_5_dias?.porcentagem_consumo || '--'}%` 
                },
              ]}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    minWidth: 150,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  headerTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  summaryPeriod: {
    fontSize: 12,
    color: '#999',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  chartNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
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
    borderRadius: 12,
    width: 250,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  selectedModalItem: {
    backgroundColor: '#007AFF',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedModalItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  historyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    margin: 20,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyDate: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  historyPercentage: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default History;