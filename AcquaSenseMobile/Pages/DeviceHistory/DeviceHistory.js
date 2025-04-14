import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const DeviceHistory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { deviceTitle } = route.params; // Obtém o título do dispositivo a partir dos parâmetros de navegação

  // Dados fictícios completos para o histórico com imagens (baseado na imagem do Figma)
  const fullHistory = [
    { id: '1', device: 'PIA 1 - Cozinha', title: 'Arruela Danificada', date: '15/01', iconImage: require('../../assets/icon-profile.png') }, // Ícone de pessoa
    { id: '2', device: 'PIA 1 - Cozinha', title: 'Arruela Solta', date: '20/01', iconImage: require('../../assets/achievement.png') }, // Ícone de ferramenta
    { id: '3', device: 'PIA 1 - Cozinha', title: 'Problema na instalação', date: '18/02', iconImage: require('../../assets/activity-history.png') }, // Ícone de engrenagem
    { id: '4', device: 'PIA 1 - Cozinha', title: 'Vazamento da torneira', date: '25/02', iconImage: require('../../assets/workout-progress.png') }, // Ícone de gota d'água
    { id: '5', device: 'PIA 1 - Cozinha', title: 'Problema na instalação', date: '08/03', iconImage: require('../../assets/activity-history.png') }, // Ícone de engrenagem
    { id: '6', device: 'PIA 1 - Cozinha', title: 'Vazamento da torneira', date: '10/04', iconImage: require('../../assets/workout-progress.png') }, // Ícone de gota d'água
    { id: '7', device: 'PIA 1 - Cozinha', title: 'Arruela Solta', date: '15/04', iconImage: require('../../assets/achievement.png') }, // Ícone de ferramenta
    { id: '8', device: 'PIA 1 - Cozinha', title: 'Arruela Danificada', date: '28/04', iconImage: require('../../assets/icon-profile.png') }, // Ícone de pessoa
    { id: '9', device: 'PIA 1 - Cozinha', title: 'Vazamento da torneira', date: '09/05', iconImage: require('../../assets/workout-progress.png') }, // Ícone de gota d'água
    // Dados para outros dispositivos
    { id: '10', device: 'PIA 2 - Cozinha', title: 'Arruela Solta', date: '12/02', iconImage: require('../../assets/achievement.png') }, // Ícone de ferramenta
    { id: '11', device: 'Banheiro 1', title: 'Vazamento no vaso', date: '05/03', iconImage: require('../../assets/workout-progress.png') }, // Ícone de gota d'água
    { id: '12', device: 'Banheiro 2', title: 'Problema na válvula', date: '10/04', iconImage: require('../../assets/activity-history.png') }, // Ícone de engrenagem
  ];

  // Filtra o histórico para o dispositivo selecionado
  const deviceHistory = fullHistory.filter((item) => item.device === deviceTitle);

  // Renderiza cada item do histórico
  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyContent}>
        <View style={styles.iconContainer}>
          <Image source={item.iconImage} style={styles.historyIcon} /> {/* Usa a imagem correspondente */}
        </View>
        <Text style={styles.historyText}>{item.title}</Text>
      </View>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <ImageBackground 
      source={require('../../assets/Pag_Home.png')} // Ajuste o caminho conforme necessário
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>❮</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{deviceTitle}</Text>

          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Histórico */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Histórico</Text>
          <FlatList
            data={deviceHistory}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
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
    elevation: 2,
  },
  menuButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#e0e0e0', // Fundo cinza claro para o ícone, como no Figma
    borderRadius: 12, // Fundo circular
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  historyIcon: {
    width: 16, // Ajusta o tamanho da imagem para caber no círculo
    height: 16,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});

export default DeviceHistory;