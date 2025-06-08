import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient';

const ProgressCircle = ({ progress = 0.165, size = 150 }) => {
  return (
    <View style={styles.container}>
      {/* Camada de fundo com gradiente */}
      <LinearGradient
        colors={['#A8B6FF', '#92EBFF']} // Gradiente de #A8B6FF para #92EBFF
        style={[styles.gradientBackground, { width: size, height: size }]}
      />
      {/* Círculo de progresso por cima */}
      <Progress.Circle
        size={size} // Tamanho do círculo
        progress={progress} // Valor do progresso (16.5% = 0.165)
        thickness={15} // Espessura da borda
        color="#98E2A8" // Cor do progresso (verde claro)
        unfilledColor="#fff" // Cor da parte não preenchida (branco)
        borderWidth={0} // Remove a borda padrão
        showsText={false} // Desativa o texto padrão do componente
        style={styles.circle}
      />
      {/* Texto do progresso */}
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={styles.progressText}>{(progress * 100).toFixed(1)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  gradientBackground: {
    position: 'absolute',
    borderRadius: 100, // Garante que o gradiente seja circular
    zIndex: -1, // Coloca o gradiente atrás do círculo
  },
  circle: {
    backgroundColor: 'transparent', // Torna o fundo do círculo transparente para mostrar o gradiente
    borderRadius: 100,
    overflow: 'hidden',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // Cor do texto (branco)
  },
});

export default ProgressCircle;