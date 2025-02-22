
import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";



export default function Inicio({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Inicio2");
    }, 5000);

    return () => clearTimeout(timer); // Limpa o temporizador ao desmontar o componente
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/LogoAcquaSense.png")}
        style={styles.logo}
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
