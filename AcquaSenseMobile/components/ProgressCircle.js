import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProgressCircle = ({ progress = 0.165, size = 150, thickness = 15 }) => {
  const radius = (size - thickness) / 2;
  const progressAngle = progress * 360;

  // Definindo as cores da borda com base no progresso
  const borderColors = {
    borderTopColor: '#98E2A8',
    borderRightColor: progress > 0.25 ? '#98E2A8' : 'transparent',
    borderBottomColor: progress > 0.5 ? '#98E2A8' : 'transparent',
    borderLeftColor: progress > 0.75 ? '#98E2A8' : 'transparent'
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Fundo do donut (parte não preenchida) */}
      <View style={[
        styles.donutBackground, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderWidth: thickness,
        }]}
      />
      
      {/* Parte preenchida do donut */}
      <View style={[
        styles.donutFill,
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderWidth: thickness,
          transform: [{ rotate: `${-90 + progressAngle}deg` }],
          ...borderColors
        }
      ]} />
      
      {/* Gradiente no centro */}
      <LinearGradient
        colors={['#A8B6FF', '#92EBFF']}
        style={[
          styles.gradientCenter, 
          { 
            width: size - thickness * 2, 
            height: size - thickness * 2,
            borderRadius: (size - thickness * 2) / 2 
          }
        ]}
      />
      
      {/* Texto central */}
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={styles.progressText}>{(progress * 100).toFixed(1)}%</Text>
      </View>
    </View>
  );
};

// Estilos sem referência à variável progress
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  donutBackground: {
    position: 'absolute',
    borderColor: '#fff',
    transform: [{ rotate: '-90deg' }],
  },
  donutFill: {
    position: 'absolute',
    borderColor: 'transparent',
  },
  gradientCenter: {
    position: 'absolute',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  progressText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProgressCircle;