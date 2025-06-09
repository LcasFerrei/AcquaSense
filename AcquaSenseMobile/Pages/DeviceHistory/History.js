import { useState, useEffect } from 'react';
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
import Hubfooter from '../../components/hub';
import { getToken } from './Noti';

const screenWidth = Dimensions.get('window').width;

// Componente de Barra Customizado
const CustomBar = ({ value, maxValue, color }) => {
  const barHeight = (value / maxValue) * 100;
  
  return (
    <View style={styles.barContainer}>
      <View style={[styles.bar, { height: `${barHeight}%`, backgroundColor: color }]} />
      <Text style={styles.barValue}>{value}</Text>
    </View>
  );
};

// Componente de Gráfico Customizado
const CustomBarChart = ({ title, labels, data, color, suffix }) => {
  const maxValue = Math.max(...data, 1);
  
  return (
    <View style={styles.customChartContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chartBarsContainer}>
        {data.map((value, index) => (
          <View key={`${title}-${index}`} style={styles.barColumn}>
            <CustomBar 
              value={value} 
              maxValue={maxValue} 
              color={color}
            />
            <Text style={styles.barLabel}>{labels[index]}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.chartNote}>
        Total: {data.reduce((a, b) => a + b, 0).toFixed(1)}{suffix}
      </Text>
    </View>
  );
};

const History = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [consumoData, setConsumoData] = useState(null);
  const [error, setError] = useState(null);

  const fetchConsumoData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const response = await fetch('https://acquasense.onrender.com/relatorio-consumo/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
  }, []);

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyDate}>{item.date}</Text>
      <Text style={styles.historyValue}>{item.value}</Text>
    </View>
  );

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
            <Text style={styles.backButtonText}>❮</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Histórico de Consumo</Text>

          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>⋮</Text>
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
              <Text style={styles.summaryPercentage}>
                {consumoData?.semana_atual?.porcentagem_consumo?.toFixed(1) || '0'}% da meta
              </Text>
              <Text style={styles.summaryPeriod}>
                {consumoData?.semana_atual?.periodo?.inicio || '--/--/----'} a {consumoData?.semana_atual?.periodo?.fim || '--/--/----'}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Ano 2025</Text>
              <Text style={styles.summaryValue}>
                {consumoData?.ano_2025?.total_litros?.toFixed(1) || '0.0'} L
              </Text>
              <Text style={styles.summaryPeriod}>
                {consumoData?.ano_2025?.periodo?.inicio || '--/--/----'} a {consumoData?.ano_2025?.periodo?.fim || '--/--/----'}
              </Text>
            </View>
          </View>

          {/* Gráfico de Barras: Consumo mensal 2025 */}
                    {consumoData?.ano_2025?.grafico_mensal && (
            <CustomBarChart
              title="Consumo Mensal 2025"
              labels={consumoData.ano_2025.grafico_mensal.meses}
              data={consumoData.ano_2025.grafico_mensal.consumo}
              color="#A8B6FF"
              suffix="L"
            />
          )}

          {/* Gráfico de Barras: Consumo semanal */}
          {consumoData?.semana_atual?.grafico_diario && (
            <View style={styles.customChartContainer}>
              <Text style={styles.sectionTitle}>Consumo Diário (Semana Atual)</Text>
              <CustomBarChart
                labels={consumoData.semana_atual.grafico_diario.dias}
                data={consumoData.semana_atual.grafico_diario.consumo}
                color="#92EBFF"
                suffix="L"
              />
              <View style={styles.datesContainer}>
                {consumoData.semana_atual.grafico_diario.datas?.map((data, index) => (
                  <Text key={index} style={styles.dateText}>{data}</Text>
                ))}
              </View>
              <Text style={styles.chartNote}>
                Total semanal: {consumoData.semana_atual.total_litros?.toFixed(1) || '0.0'}L 
                ({consumoData.semana_atual.porcentagem_consumo?.toFixed(1) || '0'}% da meta)
              </Text>
            </View>
          )}

          {/* Lista de Histórico */}
          <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>Resumo Anual</Text>
            <FlatList
              data={[
                { 
                  id: '1', 
                  date: '2024', 
                  value: `${consumoData?.ano_2024?.total_litros?.toFixed(1) || '--'}L` 
                },
                { 
                  id: '2', 
                  date: '2025', 
                  value: `${consumoData?.ano_2025?.total_litros?.toFixed(1) || '--'}L` 
                },
              ]}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>

        <Hubfooter />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
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
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  summaryPercentage: {
    fontSize: 14,
    color: '#FF4500',
    marginBottom: 5,
  },
  summaryPeriod: {
    fontSize: 12,
    color: '#999',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  chartNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  dateText: {
    fontSize: 10,
    color: '#666',
  },
  historyContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyDate: {
    fontSize: 14,
    color: '#333',
  },
  historyValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4500',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
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
  customChartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    marginVertical: 10,
  },
  barColumn: {
    alignItems: 'center',
    width: `${100 / 7}%`, // Ajuste conforme número de barras
  },
  barContainer: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 20,
    borderRadius: 4,
    marginBottom: 5,
  },
  barValue: {
    fontSize: 10,
    color: '#666',
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  }
});

export default History;
