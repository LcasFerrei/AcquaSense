import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, ScrollView, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../../components/Noti';
import Hubfooter from '../../components/hub';

const screenWidth = Dimensions.get('window').width;
const chartHeight = 200;
const maxBarHeight = chartHeight - 30; // Espaço para rótulos

const VisionGeral = () => {
  const navigation = useNavigation();

  console.log('VisionGeral: Iniciando renderização');

  const [periodo, setPeriodo] = useState('1mes');
  const [chartData, setChartData] = useState(null);
  const [pontosUso, setPontosUso] = useState([]);
  const [registrosConsumo, setRegistrosConsumo] = useState([]);
  const [vazaoMedia, setVazaoMedia] = useState('0 L/H');
  const [loading, setLoading] = useState(true);

  const periodos = [
    { label: '1 Semana', value: '1semana' },
    { label: '1 Mês', value: '1mes' },
    { label: '3 Meses', value: '3meses' },
    { label: '6 Meses', value: '6meses' },
    { label: '1 Ano', value: '1ano' },
  ];

  const fetchData = async (periodoSelecionado) => {
    try {
      setLoading(true);
      console.log('VisionGeral: Iniciando fetchData para', periodoSelecionado);
      const token = await getToken();
      console.log('VisionGeral: Token obtido', token);
      const response = await fetch(
        `https://acquasense.onrender.com/consumo-ponto-uso/?periodo=${periodoSelecionado}&residencia_id=1`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('VisionGeral: Resposta da API', response.status);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const data = await response.json();
      console.log('VisionGeral: Dados recebidos', data);

      const labels = gerarLabels(periodoSelecionado) || ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
      let totalVazao = 0;
      let countSensores = 0;
      const todosRegistros = [];

      if (data.pontos && Array.isArray(data.pontos)) {
        data.pontos.forEach((ponto, index) => {
          if (ponto.sensores && Array.isArray(ponto.sensores)) {
            ponto.sensores.forEach(sensor => {
              totalVazao += sensor.vazao_media || 0;
              countSensores++;
              if (sensor.registros && Array.isArray(sensor.registros)) {
                todosRegistros.push(...sensor.registros);
              }
            });
          }
        });
      }

      setChartData({
        labels,
        datasets: data.pontos || [],
      });
      setRegistrosConsumo(todosRegistros);
      setPontosUso(data.pontos || []);

      const mediaGeral = countSensores > 0 ? (totalVazao / countSensores).toFixed(2) : 0;
      setVazaoMedia(`${mediaGeral} L/H`);
    } catch (error) {
      console.error('VisionGeral: Erro ao buscar dados', error.message);
      setChartData({
        labels: gerarLabels(periodo) || ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        datasets: [],
      });
      setPontosUso([]);
      setRegistrosConsumo([]);
      setVazaoMedia('0 L/H');
    } finally {
      setLoading(false);
    }
  };

  const gerarLabels = (periodo) => {
    const labelsMap = {
      '1semana': ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      '1mes': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      '3meses': ['Mês 1', 'Mês 2', 'Mês 3'],
      '6meses': ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'],
      '1ano': ['Jan', 'Mar', 'Mai', 'Jul', 'Set', 'Nov'],
    };
    return labelsMap[periodo] || Array(4).fill().map((_, i) => `Sem ${i + 1}`);
  };

  const getEmoji = (tipo) => {
    const emojis = {
      'TORNEIRA': '🚰',
      'DUCHA': '🚿',
      'CHUVEIRO': '🚿',
      'BANHEIRO': '🚽',
    };
    return emojis[tipo] || '💧';
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return !isNaN(data.getTime()) ? data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR') : 'Data inválida';
  };

  const renderPontoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigation.navigate('DeviceHistory', {
        deviceId: item.id,
        deviceTitle: `${item.nome} - ${item.comodo}`,
      })}
    >
      <View style={styles.historyContent}>
        <Text style={styles.historyIcon}>{getEmoji(item.tipo)}</Text>
        <Text style={styles.historyText}>{item.nome} - {item.comodo}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  const renderRegistroItem = ({ item }) => (
    <View style={styles.registroItem}>
      <Text style={styles.registroText}>{formatarData(item.data_hora)}</Text>
      <Text style={styles.registroText}>{item.consumo}L</Text>
      <Text style={styles.registroText}>{item.sensor?.identificador || 'Sensor'}</Text>
    </View>
  );

  useEffect(() => {
    fetchData(periodo);
  }, [periodo]);

  // Função para renderizar gráfico simples nativo
  const renderSimpleChart = () => {
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return <Text>Nenhum dado disponível para exibir</Text>;
  }

  // Encontrar o valor máximo para normalizar as alturas das barras
  let maxValue = 0;
  chartData.datasets.forEach(ponto => {
    if (ponto.sensores && Array.isArray(ponto.sensores)) {
      ponto.sensores.forEach(sensor => {
        if (sensor.dados_grafico) {
          const sensorMax = Math.max(...sensor.dados_grafico);
          if (sensorMax > maxValue) maxValue = sensorMax;
        }
      });
    }
  });

  // Ajustar o máximo para um valor redondo (ex: 47 → 50, 124 → 150)
  const adjustMaxValue = (value) => {
    if (value === 0) return 100; // Valor padrão se não houver dados
    const exponent = Math.floor(Math.log10(value));
    const scale = Math.pow(10, exponent);
    const rounded = Math.ceil(value / (scale * 0.5)) * scale * 0.5;
    return rounded > 0 ? rounded : 100;
  };

  const adjustedMax = adjustMaxValue(maxValue);
  const yAxisValues = [
    adjustedMax,
    Math.round(adjustedMax * 0.75),
    Math.round(adjustedMax * 0.5),
    Math.round(adjustedMax * 0.25),
    0
  ];

  return (
    <View style={styles.chartNativeContainer}>
      <View style={styles.chartNativeYAxis}>
        {yAxisValues.map((value, index) => (
          <Text key={`y-axis-${index}`} style={styles.yAxisText}>
            {value}L
          </Text>
        ))}
      </View>
      
      <View style={styles.chartNativeContent}>
        {chartData.labels.map((label, labelIndex) => (
          <View key={`label-${labelIndex}`} style={styles.chartNativeColumn}>
            {/* Renderizar barras para cada ponto de uso */}
            {chartData.datasets.map((ponto, pontoIndex) => {
              if (!ponto.sensores) return null;
              
              return ponto.sensores.map((sensor, sensorIndex) => {
                const value = sensor.dados_grafico?.[labelIndex] || 0;
                const barHeight = (value / adjustedMax) * maxBarHeight;
                
                return (
                  <View 
                    key={`bar-${pontoIndex}-${sensorIndex}`}
                    style={[
                      styles.chartNativeBar,
                      { 
                        height: barHeight,
                        backgroundColor: getBarColor(pontoIndex, sensorIndex),
                      }
                    ]}
                  />
                );
              });
            })}
            
            <Text style={styles.chartNativeLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

  const getBarColor = (pontoIndex, sensorIndex) => {
    const colors = ['#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56'];
    return colors[(pontoIndex + sensorIndex) % colors.length];
  };

  return (
    <ImageBackground
      source={require('../../assets/Pag_Home.png')}
      style={styles.backgroundImage}
      onError={(error) => console.log('VisionGeral: Erro ao carregar imagem', error.nativeEvent.error)}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('dash')}
          >
            <Text style={styles.backButtonText}>❮</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Visão Geral</Text>

          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>⋮</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentWrapper}>
            <View style={styles.periodoContainer}>
              {periodos.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.periodoButton,
                    periodo === item.value && styles.periodoButtonSelected,
                  ]}
                  onPress={() => setPeriodo(item.value)}
                >
                  <Text style={[
                    styles.periodoButtonText,
                    periodo === item.value && styles.periodoButtonTextSelected,
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.sectionTitle}>Consumo de água por dispositivo</Text>
              {loading ? (
                <Text>Carregando dados...</Text>
              ) : (
                renderSimpleChart()
              )}
            </View>

            <View style={styles.historyContainer}>
              <Text style={styles.sectionTitle}>Pontos de Uso</Text>
              {loading ? (
                <Text>Carregando...</Text>
              ) : (
                <FlatList
                  data={pontosUso}
                  renderItem={renderPontoItem}
                  keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                  scrollEnabled={false}
                />
              )}
            </View>

            <View style={styles.flowContainer}>
              <Text style={styles.sectionTitle}>Vazão Média</Text>
              <View style={[
                styles.flowCircle,
                { backgroundColor: parseFloat(vazaoMedia) > 30 ? '#FF6B6B' : '#4BC0C0' },
              ]}>
                <Text style={styles.flowText}>{vazaoMedia}</Text>
                <Text style={styles.flowSubText}>
                  {parseFloat(vazaoMedia) > 30 ? 'Acima do normal' : 'Dentro do esperado'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <Hubfooter navigation={navigation} />
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
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
  scrollContent: {
    paddingBottom: 150,
    paddingHorizontal: 20,
  },
  contentWrapper: {
    flexGrow: 1,
  },
  periodoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  periodoButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
    minWidth: '30%',
    alignItems: 'center',
  },
  periodoButtonSelected: {
    backgroundColor: '#4BC0C0',
  },
  periodoButtonText: {
    color: '#333',
    fontSize: 12,
  },
  periodoButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    minHeight: 250,
  },
  chartNativeContainer: {
    flexDirection: 'row',
    height: 200,
    marginTop: 20,
  },
  chartNativeYAxis: {
    width: 30,
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  chartNativeContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  chartNativeBarContainer: {
    alignItems: 'center',
    width: 40,
  },
  chartNativeBar: {
    width: 20,
    backgroundColor: '#4BC0C0',
    marginBottom: 5,
  },
  chartNativeLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  historyContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  flowContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  arrow: {
    fontSize: 20,
    color: '#999',
  },
  flowCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  flowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  flowSubText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
  chartNativeContainer: {
    flexDirection: 'row',
    height: chartHeight,
    marginTop: 20,
  },
  chartNativeYAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: 5,
    alignItems: 'flex-end',
  },
  chartNativeContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 20, // Espaço para os rótulos
  },
  chartNativeColumn: {
    alignItems: 'center',
    width: 30,
    marginHorizontal: 5,
  },
  chartNativeBar: {
    width: 10,
    marginVertical: 2,
    borderRadius: 3,
  },
  chartNativeLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
  },
  yAxisText: {
    fontSize: 10,
    textAlign: 'right',
    marginRight: 5,
  },
});

export default VisionGeral;