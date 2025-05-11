import React, { useState } from 'react'; // Adicione useState
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  // Estado para controlar se há notificações (exemplo: true para exibir a bolinha)
  const [hasNotifications, setHasNotifications] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Bem vindo de volta,</Text>
        <Text style={styles.userName}>Lucas Ferreira</Text>
      </View>
      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={() => navigation.navigate('Notiview')}
        testID="notification-button"
        >
        <View style={styles.iconContainer} testID="bell-icon">
          <Icon name="bell" size={20} color="#333" />
          {/* Exibe a bolinha vermelha se hasNotifications for true */}
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