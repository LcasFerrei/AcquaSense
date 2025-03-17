import React from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground, SafeAreaView } from 'react-native';
import Header from '../../components/Header';
import News from '../../components/news';
import BarChart from '../../components/BarChart';
import GoalCard from '../../components/GoalCard';
import PipeStatusCard from '../../components/PipeStatusCard';
import DailyConsumptionCard from '../../components/DailyConsumptionCard';
import Hubfooter from '../../components/hub';
import backgroundImage from '../../assets/dash.png';

const dash = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <Header />
            <News />
            <Text style={styles.sectionTitle}>Dashboard</Text>
            <BarChart />
            <View style={styles.cardsContainer}>
              <GoalCard navigation={navigation} />
              <View style={styles.smallCards}>
                <PipeStatusCard />
                <DailyConsumptionCard />
              </View>
            </View>
          </ScrollView>
          <Hubfooter />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  smallCards: {
    flex: 1,
    marginLeft: 10,
  },
  extraContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  extraText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});

export default dash;