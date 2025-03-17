import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PipeStatusCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Tubulações</Text>
      <Text style={styles.status}>Normal</Text>
      {/* Simulação de gráfico de linha */}
      <View style={styles.lineChart}>
        <View style={styles.line} />
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
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    color: '#00C853', // Verde para "Normal"
    marginVertical: 5,
  },
  lineChart: {
    height: 50,
    justifyContent: 'center',
  },
  line: {
    height: 2,
    backgroundColor: '#A3BFFA',
    borderRadius: 1,
  },
});

export default PipeStatusCard;