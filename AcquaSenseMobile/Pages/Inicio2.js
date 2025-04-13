import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Inicio2({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/energetika.png")}
          style={styles.image}
          testID="energetika-image"
        />
        <Text style={styles.title} testID="title-text">Monitore seu consumo de água diário</Text>
        <Text style={styles.subtitle} testID="subtitle-text">
          Acompanhe diariamente a quantidade de litros que você consome
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("Inicio3")} testID="continue-button">
          <LinearGradient
            colors={["#A8B6FF", "#92EBFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50, 
    width: "100%",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10, 
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 5, 
  },
  subtitle: {
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    marginBottom: 15, 
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
