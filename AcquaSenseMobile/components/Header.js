import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from './Noti';

const Header = () => {
  const [hasNotifications, setHasNotifications] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserName = async () => {
      try {

        const token = await getToken();
        
        const response = await axios.get('https://acquasense.onrender.com/api/user-profile/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Extrai o nome completo da resposta
        const fullName = `${response.data.name} ${response.data.last_name}` || 'Usuário';
        // Pega apenas o primeiro nome para exibir
        setUserName(fullName);
        
      } catch (error) {
        console.error('Erro ao buscar nome do usuário:', error);
        setUserName('Usuário'); // Valor padrão em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, []);

  if (loading) {
    return (
      <View style={styles.header}>
        <ActivityIndicator size="small" color="#999" />
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Bem vindo de volta,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={() => navigation.navigate('Notiview')}
      >
        <View style={styles.iconContainer}>
          <Icon name="bell" size={20} color="#333" />
          {hasNotifications && <View style={styles.notificationBadge} />}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#999',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para Android
  },
  // Container para o ícone e a bolinha
  iconContainer: {
    position: 'relative', // Para posicionar a bolinha em relação ao sino
  },
  // Estilo da bolinha vermelha
  notificationBadge: {
    position: 'absolute',
    top: -4, // Ajuste para posicionar a bolinha no canto superior direito
    right: -4,
    width: 12, // Tamanho da bolinha
    height: 12,
    backgroundColor: '#FF0000', // Vermelho
    borderRadius: 6, // Metade do width/height para ser um círculo
    borderWidth: 1, // Borda branca para destacar (opcional)
    borderColor: '#fff',
  },
});

export default Header;