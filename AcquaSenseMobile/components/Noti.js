import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Noti = () => {
  const notifications = [
    {
      id: '1',
      title: 'Limite de Consumo Excedido',
      description: 'O consumo diário na PIA 1 - Cozinha excedeu o limite de 20 L/H às 14:30.',
      date: 'Hoje, 14:30',
      icon: 'warning',
    },
    {
      id: '2',
      title: 'Manutenção Agendada',
      description: 'Manutenção programada para o Banheiro 1 amanhã às 10:00.',
      date: 'Ontem, 09:15',
      icon: 'event',
    },
    {
      id: '3',
      title: 'Dica de Economia',
      description: 'Feche a torneira enquanto escova os dentes para economizar água!',
      date: '15/03/2025, 08:00',
      icon: 'lightbulb',
    },
  ];

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
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma notificação disponível.</Text>}
        scrollEnabled={false} // Desativa o scroll do FlatList
        nestedScrollEnabled={true} // Permite que o ScrollView pai gerencie o scroll
      />
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