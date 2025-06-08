import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const OfflineScreen = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/no-internet.png')} // imagem representando isso na pasta 
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sem conexão com a internet</Text>
      <Text style={styles.subtitle}>Verifique sua conexão e tente novamente</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OfflineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#004d40',
    textAlign: 'center',
    marginBottom: 20
  },
  button: {
    backgroundColor: '#00796b',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});
