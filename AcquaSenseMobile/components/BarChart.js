import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BarChart = () => {
const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const data = [30, 85, 50, 100, 40, 70, 90];
const HIGH_THRESHOLD = 70;
const MAX_HEIGHT = Math.max(...data);

return (
 <View style={styles.container}>
     <View style={styles.chart}>
      {data.map((value, index) => {
          const isHighConsumption = value > HIGH_THRESHOLD;
          const colors = isHighConsumption 
            ? ['#C58BF2', '#EEA4CE']
            : ['#92A3FD', '#9DCEFF'];

          return (
            <View key={index} style={styles.barContainer}>
              <View style={[styles.barBackground, { height: MAX_HEIGHT }]} />
              <LinearGradient
                colors={colors}
                style={[styles.bar, { height: value }]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.labelsContainer}>
        {days.map((day, index) => (
          <Text key={index} style={styles.dayLabel}>{day}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barBackground: {
    width: 14,
    backgroundColor: '#E6F0FA',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  bar: {
    width: 14,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    position: 'absolute',
    bottom: 0,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    width: 30,
  },
});

export default BarChart;