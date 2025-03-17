import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import backgroundImage from '../../assets/medidorverde.png';
import Hubfooter from '../../components/hub';
import ProgressCircle from '../../components/ProgressCircle';
import ConsumptionChart from '../../components/ConsumptionChart';

const Grafic = ({ navigation }) => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 0 }} 
        style={styles.scrollView} 
      >
        <View style={styles.container}>
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

          
          <View style={styles.monitorSection}>
            <Text style={styles.monitorTitle}>MONITORE SEU CONSUMO</Text>
            <Text style={styles.monitorDescription}>
              Essa área permitirá que você visualize o seu consumo diário. Será notificado caso passe do limite desejado
            </Text>
          </View>

          <ProgressCircle progress={0.165} size={150} />

         
          <View style={styles.consumptionChartContainer}>
            <ConsumptionChart />
          </View>
        </View>
      </ScrollView>
      <Hubfooter />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%', 
  },
  scrollView: {
    width: '100%', 
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
    paddingBottom: 100,
    alignItems: 'center', 
  },
  container: {
    width: '100%',
    alignItems: 'center', 
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
    width: '100%',
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
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
  },
  menuButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  monitorSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 70,
  },
  monitorTitle: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  monitorDescription: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  consumptionChartContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});

export default Grafic;