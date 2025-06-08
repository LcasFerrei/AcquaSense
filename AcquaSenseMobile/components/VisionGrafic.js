import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getToken } from './Noti';

const screenWidth = Dimensions.get('window').width;

const VisionGrafic = ({ navigation }) => {
  const [periodo, setPeriodo] = useState('1mes');
  const [chartData, setChartData] = useState(null);
  const [pontosUso, setPontosUso] = useState([]);
  const [registrosConsumo, setRegistrosConsumo] = useState([]);
  const [vazaoMedia, setVazaoMedia] = useState('0 L/H');
  const [loading, setLoading] = useState(true);
  const [showRegistros, setShowRegistros] = useState(false);

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
      const token = await getToken();
      const response = await fetch(
        `https://acquasense.onrender.com/consumo-ponto-uso/?periodo=${periodoSelecionado}&residencia_id=1`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();

      // Processar dados para o gráfico
      const labels = gerarLabels(periodoSelecionado) || data.labels;
      const datasets = [];
      let totalVazao = 0;
      let countSensores = 0;

      // Extrair todos os registros de consumo
      const todosRegistros = [];

      data.pontos.forEach((ponto, index) => {
        ponto.sensores.forEach(sensor => {
          // Adicionar dados do gráfico
          datasets.push({
            data: sensor.dados_grafico || Array(labels.length).fill(0),
            color: (opacity = 1) => gerarCor(index, opacity),
            strokeWidth: 2,
          });

          totalVazao += sensor.vazao_media || 0;
          countSensores++;

          // Adicionar registros à lista completa
          if (sensor.registros) {
            todosRegistros.push(...sensor.registros);
          }
        });
      });

      setChartData({
        labels,
        datasets,
        legend: [...data.pontos.map(p => p.nome)],
      });

      setRegistrosConsumo(todosRegistros);
      setPontosUso(data.pontos);

      const mediaGeral = countSensores > 0 ? (totalVazao / countSensores).toFixed(2) : 0;
      setVazaoMedia(`${mediaGeral} L/H`);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setLoading(false);
    }
  };

  // Funções auxiliares
  const gerarLabels = (periodo, registros) => {
    // Extrai o ano do primeiro registro (se existir) ou usa o ano atual
    let currentYear = new Date().getFullYear();
    if (registros && registros.length > 0) {
      const firstDate = new Date(registros[0].data_hora);
      if (!isNaN(firstDate.getTime())) {
        currentYear = firstDate.getFullYear();
      }
    }

    const labelsMap = {
      '1semana': ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      '1mes': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      '3meses': ['Mês 1', 'Mês 2', 'Mês 3'],
      '6meses': ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'],
      '1ano': [
        `Jan/${currentYear}`, '', 'Mar', '',
        'Mai', '', 'Jul', '',
        'Set', '', 'Nov', ''
      ]
    };

    return labelsMap[periodo] || Array(6).fill().map((_, i) => `Mês ${i + 1}`);
  };

  const gerarCor = (index, opacity) => {
    const cores = [
      `rgba(0, 122, 255, ${opacity})`,
      `rgba(255, 99, 132, ${opacity})`,
      `rgba(54, 162, 235, ${opacity})`,
      `rgba(255, 159, 64, ${opacity})`,
    ];
    return cores[index % cores.length];
  };

  const getEmoji = (tipo) => {
    const emojis = {
      'TORNEIRA': '🚰',
      'DUCHA': '🚿',
      'CHUVEIRO': '🚿',
      'BANHEIRO': '🚽'
    };
    return emojis[tipo] || '💧';
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
  };

  // Render Items
  const renderPontoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigation.navigate('DeviceHistory', {
        deviceId: item.id,
        deviceTitle: `${item.nome} - ${item.comodo}`
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

  return (
    <ScrollView style={styles.container}>
      {/* Seletor de Período */}
      <View style={styles.periodoContainer}>
        {periodos.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.periodoButton,
              periodo === item.value && styles.periodoButtonSelected
            ]}
            onPress={() => setPeriodo(item.value)}
          >
            <Text style={[
              styles.periodoButtonText,
              periodo === item.value && styles.periodoButtonTextSelected
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
        ) : chartData ? (
          <LineChart
            data={chartData}
            width={screenWidth - 80}
            height={220}
            yAxisSuffix="L"
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
                r: '2',
                strokeWidth: '1',
                stroke: '#fff',
              },
              // Adicione estas configurações para remover as linhas
              propsForBackgroundLines: {
                strokeWidth: 0, // Remove as linhas de grade
              },
              withHorizontalLines: false, // Remove linhas horizontais
              withVerticalLines: false, // Remove linhas verticais
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            withHorizontalLabels={true} // Mantém os labels horizontais
            withVerticalLabels={true} // Mantém os labels verticais
            withShadow={false}
          />
        ) : (
          <Text>Nenhum dado disponível</Text>
        )}
      </View>

      {/* Seção: Pontos de Uso */}
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

      {/* Seção: Vazão Média */}
      <View style={styles.flowContainer}>
        <Text style={styles.sectionTitle}>Vazão Média</Text>
        <View style={[
          styles.flowCircle,
          { backgroundColor: parseFloat(vazaoMedia) > 30 ? '#FF6B6B' : '#4BC0C0' }
        ]}>
          <Text style={styles.flowText}>{vazaoMedia}</Text>
          <Text style={styles.flowSubText}>
            {parseFloat(vazaoMedia) > 30 ? 'Acima do normal' : 'Dentro do esperado'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  toggleButton: {
    backgroundColor: '#4BC0C0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  registrosContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  registroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  registroText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
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
});

export default VisionGrafic;