import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const News = () => {
  return (
    <LinearGradient colors={['#A1C4FD', '#C2E0FA']} style={styles.container}>
      {/*  Container para as bolinhas de fundo decorativas */}
      <View style={styles.backgroundDots}>
        {/* Trecho de bolinhas para ficar espalhadas na tela, apenas efeito */}
        <View style={[styles.dot, styles.bigDot, { top: 10, left: 20 }]} />
        <View style={[styles.dot, styles.bigDot, { bottom: 20, right: 30 }]} />
        <View style={[styles.dot, { top: 40, left: 80, width: 10, height: 10 }]} />
        <View style={[styles.dot, { bottom: 50, right: 100, width: 8, height: 8 }]} />
        <View style={[styles.dot, { top: 90, right: 50, width: 12, height: 12 }]} />
        <View style={[styles.dot, { bottom: 70, left: 60, width: 15, height: 15 }]} />
        <View style={[styles.dot, { top: 150, right: 20, width: 6, height: 6 }]} />
        <View style={[styles.dot, { bottom: 120, left: 30, width: 10, height: 10 }]} />
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        <View style={styles.textAndButtonContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Novidades do AquaSense</Text>
            <Text style={styles.description}>
              Após a criação do AquaSense, tivemos uma redução em mais de 20% do consumo de água com consciência de Fortaleza
            </Text>
          </View>
          {/* <TouchableOpacity style={styles.button}>
            <LinearGradient colors={['#C58BF2', '#EEA4CE']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Veja Mais</Text>
            </LinearGradient>
          </TouchableOpacity> */}
        </View>
        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            <Text style={styles.percentage}>20%</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundDots: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dot: {  // Estilo para as bolinhas de efeito
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
  },
  bigDot: { // Estilo das bolinhas maiores
    width: 40,
    height: 40,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  circleContainer: {
    marginLeft: 15,
  },
  circle: { // Círculo da area de porcentagem
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  progress: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF69B4',
    opacity: 0.3,
    transform: [{ scaleY: 0.2 }],
    bottom: 0,
  },
  percentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  textAndButtonContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  button: {
    borderRadius: 15,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  buttonGradient: {
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default News;