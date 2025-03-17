import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Recebe a prop `navigation` para realizar a navegação
const GoalCard = ({ navigation }) => {
  const currentLiters = 160; // Valor atual ajustado para o máximo
  const maxLiters = 200; // Valor máximo (fictício)
  const progressHeight = (currentLiters / maxLiters) * 100; // Calcula a altura do progresso (100%)

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Grafic')} // Navega para a tela Grafic ao clicar
    >
      <Text style={styles.title}>Meta diária</Text>
      <Text style={styles.subtitle}>Atualizações em tempo real</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#F28B8B', '#F28B8B', '#F9FFB8', '#F9FFB8', '#B8FFB7']} // Gradiente com as cores solicitadas
            style={[styles.progress, { height: `${progressHeight}%` }]}
          />
        </View>
        <View style={styles.labels}>
          {[180, 150, 120, 90, 60, 30, 0].map((value, index) => (
            <Text key={index} style={styles.label}>{value} Litros</Text>
          ))}
        </View>
      </View>
      <Text style={styles.currentValue}>{currentLiters} Litros</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    width: 20,
    height: 200,
    backgroundColor: '#E6F0FA',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  labels: {
    marginLeft: 10,
    justifyContent: 'space-between',
    height: 200,
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  currentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default GoalCard;