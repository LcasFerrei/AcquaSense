import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Certifique-se de instalar react-native-vector-icons
import { useNavigation } from '@react-navigation/native';

const Hubfooter = () => {
    const navigation = useNavigation();
  return (
    <>
      
      {/* Botões fixos na parte inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("DashboardScreen")} >
          <Icon name="home" size={28} color="#6C63FF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate("DashScreen")} >
          <Icon name="show-chart" size={28} color="#6C63FF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.centralButton}  onPress={() => navigation.navigate("SearchScreen")}>
          <Icon name="search" size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}  onPress={() => navigation.navigate("ChatScreen")}>
          <Icon name="pie-chart" size={28} color="#6C63FF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}  onPress={() => navigation.navigate("UserScreen")}>
          <Icon name="person" size={28} color="#6C63FF" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 70,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bottomButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  centralButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default Hubfooter;