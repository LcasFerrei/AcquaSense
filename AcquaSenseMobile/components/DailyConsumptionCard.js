import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { getToken } from './Noti';

const DailyConsumptionCard = () => {
  const [consumptionData, setConsumptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyConsumption = async () => {
      try {
        const token = await getToken();
        const response = await axios.get('http://127.0.0.1:8000/consumo-diario/', {
          headers: {
            'Authorization': `Bearer ${token}` // Supondo autenticação JWT
          }
        });
        setConsumptionData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyConsumption();
  }, []);

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro: {error}</Text>;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Consumo do dia</Text>
      <View style={styles.circle}>
        <Text style={styles.percentage}>{consumptionData.porcentagem}%</Text>
      </View>
      <Text style={styles.meta}>Meta: {consumptionData.meta} Litros</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  consumption: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  meta: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});