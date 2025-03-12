// DailyConsumptionCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DailyConsumptionCard = () => {
  const consumption = 96.48; // Consumo fictício
  const percentage = 80.4; // Percentual fictício

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Consumo do dia</Text>
      <Text style={styles.consumption}>{consumption} Litros</Text>
      <View style={styles.circle}>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
    </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  consumption: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F0FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DailyConsumptionCard;