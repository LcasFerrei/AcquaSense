import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { LineChart } from 'react-native-chart-kit';
import backgroundImage from '../../assets/medidorverde.png';
import Hubfooter from '../../components/hub';
import ProgressCircle from '../../components/ProgressCircle'; 
import ConsumptionChart from '../../components/ConsumptionChart';

const ChatScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Seção para o header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate("dashcopia")}
          >
            <Text style={styles.backButtonText}>❮</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Consumo diário</Text>

          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Seção de texto "Monitore seu consumo" */}
        <View style={styles.monitorSection}>
          <Text style={styles.monitorTitle}>MONITORE SEU CONSUMO</Text>
          <Text style={styles.monitorDescription}>
            Essa área permitirá que você visualize o seu consumo diário. Será notificado caso passe do limite desejado
          </Text>
        </View>

        {/* Adicionando o componente ProgressCircle */}
        <ProgressCircle progress={0.165} size={150} />

        {/* Ajustando a posição do ConsumptionChart */}
        <View style={styles.consumptionChartContainer}>
          <ConsumptionChart />
        </View>
      </View>  
      <Hubfooter />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: '100%',
  },
  // Estilos para o header
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50, 
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  menuButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  menuButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Estilos para a seção "Monitore seu consumo"
  monitorSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 70,
  },
  monitorTitle: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: 'center',
  },
  monitorDescription: {
    color: "#000",
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22, 
  },
  // Novo estilo para o contêiner do ConsumptionChart
  consumptionChartContainer: {
    marginTop: 30, // Ajuste para subir o gráfico (valor negativo sobe na tela)
    alignItems: 'center', 
  },
});

export default ChatScreen;