import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as SecureStore from 'expo-secure-store';

  // Função para obter o token de forma universal
  export const getToken = async () => {
    if (Platform.OS === 'web') {
      return localStorage.getItem('auth_access_token');
    } else {
      try {
        return await SecureStore.getItemAsync('auth_access_token');
      } catch (error) {
        console.error('Erro ao acessar SecureStore:', error);
        return null;
      }
    }
  };

const Noti = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para renovar o token
  const refreshToken = async () => {
    try {
      let refreshToken;
      
      if (Platform.OS === 'web') {
        refreshToken = localStorage.getItem('auth_refresh_token');
      } else {
        refreshToken = await SecureStore.getItemAsync('auth_refresh_token');
      }

      const response = await fetch('https://acquasense.onrender.com/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Falha ao renovar token');
      }

      const data = await response.json();
      
      // Armazena o novo token
      if (Platform.OS === 'web') {
        localStorage.setItem('auth_access_token', data.access);
      } else {
        await SecureStore.setItemAsync('auth_access_token', data.access);
      }
      
      return data.access;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      // Limpa os tokens e redireciona para login
      if (Platform.OS === 'web') {
        localStorage.removeItem('auth_access_token');
        localStorage.removeItem('auth_refresh_token');
        window.location.href = '/login';
      } else {
        await SecureStore.deleteItemAsync('auth_access_token');
        await SecureStore.deleteItemAsync('auth_refresh_token');
        navigation.navigate('Login');
      }
      return null;
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch('http://127.0.0.1:8000/alerts/notificacoes/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token expirado - tentar renovar
        const newToken = await refreshToken();
        if (newToken) {
          return fetchNotifications(); // Tentar novamente com novo token
        }
        throw new Error('Sessão expirada - faça login novamente');
      }

      if (!response.ok) {
        throw new Error(`Erro ao carregar notificações: ${response.status}`);
      }

      const data = await response.json();
      
      const mapped = data.notificacoes.map((item) => ({
        id: item.id.toString(),
        title: item.title,
        description: item.details,
        date: item.time,
        icon: item.unread ? 'notifications' : 'notifications-none',
      }));
      
      setNotifications(mapped);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      Alert.alert('Erro', error.message || 'Não foi possível carregar as notificações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => alert(`Detalhes da notificação: ${item.description}`)}
    >
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={24} color="#4BC0C0" />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
        <Text style={styles.notificationDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Notificações</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4BC0C0" />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma notificação disponível.</Text>}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default Noti;
