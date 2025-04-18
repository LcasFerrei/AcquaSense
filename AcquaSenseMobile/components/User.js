import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Switch, ScrollView } from 'react-native';
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
    language: 'Português', // Idioma
    waterLimit: '200', // Limite de consumo de água (em litros por dia)
  });

  // Estado para controlar a edição do usuário
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userInfo.name);
  const [newEmail, setNewEmail] = useState(userInfo.email);

  // Estado para adicionar um novo sensor
  const [newSensorName, setNewSensorName] = useState('');

  // Estado para o limite de consumo de água
  const [newWaterLimit, setNewWaterLimit] = useState(preferences.waterLimit);

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

  // Função para salvar o limite de consumo de água
  const handleSaveWaterLimit = () => {
    if (newWaterLimit.trim() === '' || isNaN(newWaterLimit) || Number(newWaterLimit) <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido para o limite de consumo de água.');
      return;
    }

    setPreferences((prev) => ({
      ...prev,
      waterLimit: newWaterLimit,
    }));
    Alert.alert('Sucesso', 'Limite de consumo de água atualizado!');
  };

  // Função para selecionar o idioma
  const handleLanguageChange = (language) => {
    setPreferences((prev) => ({
      ...prev,
      language: language,
    }));
    Alert.alert('Sucesso', `Idioma alterado para ${language}!`);
  };

  // Função para redefinir configurações
  const handleResetSettings = () => {
    Alert.alert(
      'Redefinir Configurações',
      'Você tem certeza de que deseja redefinir todas as configurações para os valores padrão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: () => {
            setPreferences({
              notifications: true,
              darkMode: false,
              emailAlerts: true,
              waterUsageTips: false,
              language: 'Português',
              waterLimit: '200',
            });
            setSensors([
              { id: '1', name: 'Sensor PIA 1 - Cozinha' },
              { id: '2', name: 'Sensor Banheiro 1' },
            ]);
            Alert.alert('Sucesso', 'Configurações redefinidas com sucesso!');
          },
        },
      ]
    );
  };

  // Função para excluir conta
  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Você tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => {
            Alert.alert('Conta Excluída', 'Sua conta foi excluída com sucesso.');
            // Aqui você pode adicionar a lógica para excluir a conta (ex.: chamada à API)
          },
          style: 'destructive',
        },
      ]
    );
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
    { key: 'darkMode', label: 'Modo Escuro' },
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

  // Opções de idioma
  const languageOptions = [
    { label: 'Português', value: 'Português' },
    { label: 'English', value: 'English' },
    { label: 'Español', value: 'Español' },
  ];

  return (
    <ScrollView style={styles.container}>
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
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
      </View>

      {/* Seção: Idioma */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Idioma</Text>
        <View style={styles.languageContainer}>
          {languageOptions.map((language) => (
            <LinearGradient
              key={language.value}
              colors={
                preferences.language === language.value
                  ? ['#A8B6FF', '#92EBFF']
                  : ['#f0f0f0', '#f0f0f0']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.languageButton}
            >
              <TouchableOpacity onPress={() => handleLanguageChange(language.value)}>
                <Text
                  style={[
                    styles.languageButtonText,
                    preferences.language === language.value && styles.selectedLanguageButtonText,
                  ]}
                >
                  {language.label}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>
      </View>

      {/* Seção: Limite de Consumo de Água */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Limite de Consumo de Água (litros/dia)</Text>
        <TextInput
          style={styles.input}
          value={newWaterLimit}
          onChangeText={setNewWaterLimit}
          placeholder="Digite o limite de consumo de água (em litros)"
          keyboardType="numeric"
        />
        <Text style={styles.infoText}>Limite atual: {preferences.waterLimit} litros/dia</Text>
        <LinearGradient
          colors={['#A8B6FF', '#92EBFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.button}
        >
          <TouchableOpacity onPress={handleSaveWaterLimit}>
            <Text style={styles.buttonText}>Salvar Limite</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Seção: Sensores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sensores</Text>
        <FlatList
          data={sensors}
          renderItem={renderSensor}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum sensor adicionado.</Text>}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
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

      {/* Seção: Redefinir Configurações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Redefinir Configurações</Text>
        <LinearGradient
          colors={['#FF6B6B', '#FF8787']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.button}
        >
          <TouchableOpacity onPress={handleResetSettings}>
            <Text style={styles.buttonText}>Redefinir Tudo</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Seção: Excluir Conta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Excluir Conta</Text>
        <LinearGradient
          colors={['#FF6B6B', '#FF8787']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.button}
        >
          <TouchableOpacity onPress={handleDeleteAccount}>
            <Text style={styles.buttonText}>Excluir Conta</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
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
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageButton: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  selectedLanguageButtonText: {
    fontWeight: 'bold',
  },
});

export default User;