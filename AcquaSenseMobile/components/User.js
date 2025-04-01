import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const User = () => {
  // Estado para as informações do usuário
  const [userInfo, setUserInfo] = useState({
    name: 'Lucas Ferreira',
    email: 'lucas@email.com',
  });

  // Estado para os sensores
  const [sensors, setSensors] = useState([
    { id: '1', name: 'Sensor PIA 1 - Cozinha' },
    { id: '2', name: 'Sensor Banheiro 1' },
  ]);

  // Estado para as preferências
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    emailAlerts: true,
    waterUsageTips: false,
  });

  // Estado para controlar a edição do usuário
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userInfo.name);
  const [newEmail, setNewEmail] = useState(userInfo.email);

  // Estado para adicionar um novo sensor
  const [newSensorName, setNewSensorName] = useState('');

  // Função para salvar as alterações do usuário
  const handleSaveUserInfo = () => {
    setUserInfo({ name: newName, email: newEmail });
    setIsEditing(false);
    Alert.alert('Sucesso', 'Informações do usuário atualizadas!');
  };

  // Função para adicionar um novo sensor
  const handleAddSensor = () => {
    if (newSensorName.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira o nome do sensor.');
      return;
    }

    const newSensor = {
      id: (sensors.length + 1).toString(),
      name: newSensorName,
    };

    setSensors([...sensors, newSensor]);
    setNewSensorName('');
    Alert.alert('Sucesso', 'Sensor adicionado com sucesso!');
  };

  // Função para alternar preferências
  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Renderizar cada sensor na lista
  const renderSensor = ({ item }) => (
    <View style={styles.sensorItem}>
      <Text style={styles.sensorText}>{item.name}</Text>
      <TouchableOpacity onPress={() => Alert.alert('Ação', `Editar ou remover ${item.name}`)}>
        <Icon name="more-vert" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  // Lista de preferências para exibir
  const preferenceList = [
    { key: 'notifications', label: 'Notificações' },
    { key: 'emailAlerts', label: 'Alertas por E-mail' },
    { key: 'waterUsageTips', label: 'Dicas de Uso de Água' },
  ];

  // Renderizar cada item de preferência
  const renderPreference = ({ item }) => (
    <View style={styles.preferenceItem}>
      <Text style={styles.preferenceText}>{item.label}</Text>
      <Switch
        value={preferences[item.key]}
        onValueChange={() => togglePreference(item.key)}
        trackColor={{ false: '#ccc', true: '#4BC0C0' }}
        thumbColor={preferences[item.key] ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Seção: Informações do Usuário */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações do Usuário</Text>
        {isEditing ? (
          <View>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Nome"
            />
            <TextInput
              style={styles.input}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="E-mail"
              keyboardType="email-address"
            />
            <View style={styles.buttonRow}>
              <LinearGradient
                colors={['#A8B6FF', '#92EBFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.button}
              >
                <TouchableOpacity onPress={handleSaveUserInfo}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={['#A8B6FF', '#92EBFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.button}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(false);
                    setNewName(userInfo.name);
                    setNewEmail(userInfo.email);
                  }}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.infoText}>Nome: {userInfo.name}</Text>
            <Text style={styles.infoText}>E-mail: {userInfo.email}</Text>
            <LinearGradient
              colors={['#A8B6FF', '#92EBFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.button}
            >
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Editar Informações</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Seção: Preferências */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        <FlatList
          data={preferenceList}
          renderItem={renderPreference}
          keyExtractor={(item) => item.key}
          scrollEnabled={false} // Desativa o scroll do FlatList
          nestedScrollEnabled={true} // Permite que o ScrollView pai gerencie o scroll
        />
      </View>

      {/* Seção: Sensores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sensores</Text>
        <FlatList
          data={sensors}
          renderItem={renderSensor}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum sensor adicionado.</Text>}
          scrollEnabled={false} // Desativa o scroll do FlatList
          nestedScrollEnabled={true} // Permite que o ScrollView pai gerencie o scroll
        />

        {/* Campo para adicionar novo sensor */}
        <TextInput
          style={styles.input}
          value={newSensorName}
          onChangeText={setNewSensorName}
          placeholder="Nome do novo sensor"
        />
        <LinearGradient
          colors={['#A8B6FF', '#92EBFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.button}
        >
          <TouchableOpacity onPress={handleAddSensor}>
            <Text style={styles.buttonText}>Adicionar Sensor</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sensorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sensorText: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  preferenceText: {
    fontSize: 14,
    color: '#333',
  },
});


export default User;