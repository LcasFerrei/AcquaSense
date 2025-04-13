import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Inicio({ navigation }) {
  useEffect(() => {
    const checkFirstAccess = async () => {
      try {
        const tutorialCompleted = await AsyncStorage.getItem('tutorialCompleted');
        
        if (tutorialCompleted === 'true') {
          // Se já viu o tutorial, vai direto para Inicio4
          setTimeout(() => {
            navigation.replace("Inicio4");
          }, 5000);
        } else {
          // Se é o primeiro acesso, vai para Inicio2 após 5 segundos
          setTimeout(() => {
            navigation.replace("Inicio2");
          }, 5000);
        }
      } catch (error) {
        console.error("Erro ao verificar primeiro acesso:", error);
        // Em caso de erro, vai para Inicio2 por padrão
        setTimeout(() => {
          navigation.replace("Inicio2");
        }, 5000);
      }
    };

    checkFirstAccess();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/LogoAcquaSense.png")}
        style={styles.logo}
        testID="logo-image"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B3D9FF",
  },
  logo: {
    width: 500,
    height: 500,
    resizeMode: "contain",
  },
});