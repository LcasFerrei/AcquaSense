import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PipeStatusCard = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('History')} // Navega para a tela History
    >
      <Text style={styles.title}>Histórico</Text>
      <Text style={styles.status}>Normal</Text>
      {/* Simulação de gráfico de linha */}
      <View style={styles.lineChart}>
        <View style={styles.line} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
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